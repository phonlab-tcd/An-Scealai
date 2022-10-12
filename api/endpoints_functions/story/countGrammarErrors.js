
// Using mock data for grammar inforation
// Assume all the data is from the same user
const dbEntries = require('./storygrammarerrors.json');

const errorSet = [];

// create an array of error objects: {error, sentence, timestamp}
for (const errorObject of dbEntries) {
  for (const entry of errorObject.sentences) {
    if (entry.errors.length > 0) {
      for (const error of entry.errors) {
        // add to array: {error, sentence, timestamp}
        const errorEntry = {
          error: error.type,
          sentence: entry.sentence,
          date: new Date(+errorObject.timestamp.$date.$numberLong)
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
    errorDict[entry.error] = 0;
  }
}

/**
 * Returns a dictionary of errors and their counts for a given student/story id
 *
 * @param {Object} req
 * @param {Object} res
 * @return {Object} error dictionary
 */
async function getGrammarErrors(req, res) {
  console.log(errorDict);
  return res.status(200).json(errorDict);
}

module.exports = getGrammarErrors;
