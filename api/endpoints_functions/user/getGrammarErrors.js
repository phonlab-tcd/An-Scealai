const User = require('../../models/user');

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
        console.log(errorEntry);
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

// create a dictionary of errors and dates that the error was made
for (const entry of unique) {
  if (entry.error in errorDict) {
    if (entry.date in errorDict[entry.error]) {
      errorDict[entry.error][entry.date] += 1;
    } else {
      errorDict[entry.error][entry.date] = 1;
    }
  } else {
    errorDict[entry.error] = {};
    errorDict[entry.error][entry.date] = 1;
  }
}

/**
 * Returns a dictionary of errors and dates for a given student
 *
 * @param {Object} req
 * @param {Object} res
 * @return {Object} error dictionary
 */
async function getGrammarErrors(req, res) {
  return res.status(200).json(errorDict);
}

module.exports = getGrammarErrors;
