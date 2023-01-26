const mongoose = require('mongoose');
const UserGrammarCounts = require('../../models/userGrammarCounts');

/**
 * Returns a dictionary of errors and dates for a given student
 *
 * @param {Object} req ownerID
 * @param {Object} res
 * @return {Object} error dictionary
 */
async function getUserGrammarCounts(req, res) {
  const ownerId = new mongoose.mongo.ObjectId(req.params.ownerId);
  const userGrammarCounts = await UserGrammarCounts.find({'owner': ownerId});

  if (!userGrammarCounts) {
    return res.json({});
  }

  // filter out entries that don't have error counts
  const filteredData = userGrammarCounts.filter(function(el) {
    return el.errorCounts != null;
  });

  const errorCountsDict = {};

  // manipulate the data into an object that can be used for graphing:
  // keys: error names (uru, seimhu, etc.)
  // values: {{timestamp: errorCount}, {timestamp2: errorCount2}, etc.}
  for (const entry of filteredData) {
    entry = entry.toJSON();
    for (const [key, val] of Object.entries(entry.errorCounts)) {
      const date = new Date(+entry.updatedAt).toISOString().slice(0, 10);
      if (! (key in errorCountsDict)) {
        errorCountsDict[key] = {};
      }
      errorCountsDict[key][date] = val;
    }
  }
  return res.json(errorCountsDict);
}

module.exports = {getUserGrammarCounts};