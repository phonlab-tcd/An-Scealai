const mongoose = require('mongoose');
const UserGrammarCounts = require('../../models/userGrammarCounts');

/**
 * Returns a dictionary of errors and dates for a given student
 * Currently used for time series chart on the stats dashboard
 * @param {Object} req ownerID
 * @param {Object} res
 * @return {Promise} error dictionary
 */
async function getTimeGrammarCounts(req, res) {
  const ownerId = new mongoose.mongo.ObjectId(req.params.ownerId);

  const conditions = {'owner': ownerId};
  if (req.body.startDate !== '' && req.body.endDate !== '') {
    let endDate = new Date(req.body.endDate)
    endDate.setDate(endDate.getDate() + 1);

    conditions['updatedAt'] = {
      '$gte': new Date(req.body.startDate),
      '$lte': endDate,
    };
  };

  const userGrammarCounts = await UserGrammarCounts.find(conditions);

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
  for (let entry of filteredData) {
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

module.exports = {getTimeGrammarCounts};
