const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
import { UniqueStoryErrors, SentenceError } from './getUniqueErrorTypeCounts';

const model = mongoose.model("storyGrammarErrors", new mongoose.Schema({owner: ObjectId, storyId: ObjectId, sentences: Array, timestamp:Date}))

/**
 * Add unique story error counts and associated sentences to the DB
 * @param {Object} req body: Unique story errors object; user: User information
 * @param {Object} res object to return response
 * @param {Object} next
 * @return {Promise} Success or error Message
 */
export = async (req, res, next) => {
  const sentences = req.body.sentences;
  
  const storyId = new mongoose.mongo.ObjectId(req.body.storyId);
  const userId = new mongoose.mongo.ObjectId(req.user._id);
  
  await model.create({owner: userId, storyId: storyId, sentences: sentences, timestamp: new Date()});
  
  // Create a new 'empty' uniqueStoryErrors object in DB if one doesn't
  // exist for this story already
  const foundUniqueStoryErrors = await UniqueStoryErrors.findOne({"storyId": storyId});
  if (!foundUniqueStoryErrors) {
    const uniqueStoryErrors = new UniqueStoryErrors(
      {
        storyId: storyId,
        sentenceErrors: []
      }
    );
    await uniqueStoryErrors.save();
  }
  
  if (sentences && sentences.length > 0) {
    for (const entry of sentences) {
      // entry[0] = array of error tags, entry[1] = sentence, entry[2] = index (not used)
      await UniqueStoryErrors.updateOne(
        // QUERY: find all uniqueStoryErrors documents without 'sentence'
        {
          $and: [
            {"storyId": storyId},
            {
              "sentenceErrors": {
                $not: { $elemMatch: { sentence: entry[1] } }
              }
            }
          ]
        },
        // UPDATE
        {
          $push: {
            sentenceErrors: {
              sentence: entry[1],
              grammarErrors: entry[0]
            }
          }
        }
      )
    }
  }
  res.json();
}
