const mongoose = require('mongoose');
const UserGrammarCounts = require('../../models/userGrammarCounts');

/**
 * Returns a dictionary of errors and dates for a given student
 *
 * @param {Object} req
 * @param {Object} res
 * @return {Object} error dictionary
 */
async function getUserGrammarCounts(req, res) {
  const ownerId = new mongoose.mongo.ObjectId(req.params.ownerId);
  const userGrammarCounts = await UserGrammarCounts.find({'owner': ownerId});

  if (!userGrammarCounts) {
    console.log('No DB entries');
    return res.json({});
  }

  const filteredData = userGrammarCounts.filter(function(el) {
    return el.errorCounts != null;
  });


  const errorCountsDict = {};

  for (const entry of filteredData) {
    entry = entry.toJSON();

    for (const [key, val] of Object.entries(entry.errorCounts)) {
      const date = new Date(+entry.timestamp).toISOString().slice(0, 10);
      if (! (key in errorCountsDict)) {
        errorCountsDict[key] = {};
      }
      errorCountsDict[key][date] = val;
    }
  }

  console.log(errorCountsDict);


  return res.json(errorCountsDict);
}

module.exports = {getUserGrammarCounts};
