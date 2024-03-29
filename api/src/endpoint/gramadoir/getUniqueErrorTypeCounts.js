const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Types;

const SentenceError = new Schema(
    {
      sentence: String,
      grammarErrors: {
        type: Array,
        of: Object, // gramadoir error object
      },
    },
);

const UniqueStoryErrors = mongoose.model(
    'UniqueStoryErrors',
    new Schema(
        {
          storyId: {
            type: ObjectId,
            unique: true,
          },
          sentenceErrors: {
            type: Array,
            of: SentenceError,
          },
        },
    ),
);

/**
 * Get unique story error counts and associated sentences from the DB
 * @param {Object} req params: Story ID
 * @param {Object} res object to return response
 * @param {Object} next
 * @return {Promise} Dictionary of error counts and sentences
 */
async function getUniqueErrorTypeCounts(req, res, next) {
  const storyId = new mongoose.mongo.ObjectId(req.params.storyId);
  const uniqueStoryErrors = await UniqueStoryErrors.findOne({'storyId': storyId});
  if (!uniqueStoryErrors) {
    // Old stories won't have new logging yet.
    // TODO: migrate old stories to have grammar counts and replace this with a 404
    return res.json({}); // Without the 'return' the code procedes to the end, making the backend crash
  }
  const errorTypeCounts = uniqueStoryErrors.sentenceErrors
      .map((se) => se.grammarErrors)
      .flat()
      .reduce((countDict, grammarError) => {
        countDict[grammarError.type] = countDict[grammarError.type] + 1 || 1;
        return countDict;
      }, {});

  res.json(errorTypeCounts);
}

module.exports = {SentenceError, UniqueStoryErrors, getUniqueErrorTypeCounts};
