const UserGrammarCounts = require('../../models/userGrammarCounts');

/**
 * Get total error names and associated counts from the DB
 * @param {Object} req params: Story ID
 * @param {Object} res object to return response
 * @param {Object} next
 * @return {Promise} Dictionary of error counts and sentences
 */
async function getUserGrammarCounts(req, res, next) {
  const errorCounts = await UserGrammarCounts.find({'errorCounts': {$ne: null}}, {'errorCounts': 1, '_id': 0});

  const totalErrorCounts = {};

  // create a dictionary of error name and total counts
  for (const entry of errorCounts) {
    for (const [key, value] of Object.entries(entry.errorCounts)) {
      if (!totalErrorCounts[key]) totalErrorCounts[key] = 0;
      totalErrorCounts[key] += value;
    }
  }

  res.json(totalErrorCounts);
}
module.exports = {getUserGrammarCounts};
