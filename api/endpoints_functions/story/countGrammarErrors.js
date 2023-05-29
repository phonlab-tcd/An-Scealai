// @ts-nocheck
const StoryGrammarErrors = require('../../models/storygrammarerrors');
const {API404Error} = require('../../utils/APIError');
const mongoose = require('mongoose');

/**
 * Returns a dictionary of errors and their counts for a given student/story id
 *
 * @param {Object} req story id
 * @param {Object} res
 * @return {Promise} error dictionary
 */
async function getGrammarErrors(req, res) {
  if (! mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      invalidObjectId: req.params.id,
    });
  }
  // get grammar error objects by student id
  const grammarErrors = await StoryGrammarErrors.find({'owner': req.params.id});
  if (grammarErrors.length > 0) {
    const errorSet = [];

    // create an array of error objects: {error, sentence, timestamp}
    for (const errorObject of grammarErrors) {
      for (const entry of errorObject.sentences) {
        if (entry.errors.length > 0) {
          for (const error of entry.errors) {
            // add to array: {error, sentence, timestamp}
            const errorEntry = {
              error: error.type,
              sentence: entry.sentence,
              date: new Date(+errorObject.timestamp)
                  .toISOString()
                  .slice(0, 10),
            };
            errorSet.push(errorEntry);
          }
        }
      }
    }

    // filter out errors in array that appear in the same sentence on the same day
    const unique = errorSet.filter(
        (o, i) => i === errorSet.findIndex((oo) => o.error === oo.error &&
        o.sentence === oo.sentence && o.date === oo.date),
    );

    const errorDict = {};

    // create a dictionary of errors and counts
    for (const entry of unique) {
      if (entry.error in errorDict) {
        errorDict[entry.error] += 1;
      } else {
        errorDict[entry.error] = 1;
      }
    }

    return res.status(200).json(errorDict);
  } else {
    return res.status(200).json({});
  }

  throw new API404Error('Could not find a story with id ' + req.params.id);
}

module.exports = getGrammarErrors;
