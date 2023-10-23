const mongoose = require("mongoose");
const UserGrammarCounts = require("../../models/userGrammarCounts");

/**
 * Returns a dictionary of errors and dates for a given student
 * Currently used for time series chart on the stats dashboard
 * @param {Object} req ownerID
 * @param {Object} res
 * @return {Promise} error dictionary
 */
async function getTimeGrammarCounts(req, res) {

  let ownerId = null;

  try {
    ownerId = new mongoose.mongo.ObjectId(req.params.ownerId);
  }
  catch (error) {
    return res.status(404).json(`id ${req.params.ownerId} is not a valid ObjectId`);
  }

  const conditions = { owner: ownerId };

  // set date range restrition on data retrieval
  if (req.body.startDate !== "" && req.body.endDate !== "") {  // teacher has provided date range
    let endDate = new Date(req.body.endDate);
    endDate.setDate(endDate.getDate() + 1);

    conditions["updatedAt"] = {
      $gte: new Date(req.body.startDate),
      $lte: endDate,
    };
  } else {                                                    // teach has not provided date range - default 90 days
    let endDate = new Date();
    endDate.setDate(endDate.getDate() + 1);
    let startDate = new Date();
    startDate.setTime(endDate.getTime() - 90 * 24 * 60 * 60 * 1000);

    conditions["updatedAt"] = {
      $gte: startDate,
      $lte: endDate,
    };
  }

  const userGrammarCounts = await UserGrammarCounts.find(conditions);

  if (!userGrammarCounts) {
    return res.json({});
  }

  // filter out entries that don't have error counts
  const filteredData = userGrammarCounts.filter(function (el) {
    return el.errorCounts != null;
  });

  const errorCountsDict = {};

  // manipulate the data into an object that can be used for graphing:
  // keys: error names (uru, seimhu, etc.)
  // values: {{timestamp: errorCount}, {timestamp2: errorCount2}, etc.}
  for (let entryObj of filteredData) {
    const entry = entryObj.toJSON();
    for (const [key, val] of Object.entries(entry.errorCounts)) {
      const date = new Date(+entry.updatedAt).toISOString().slice(0, 10);
      if (!(key in errorCountsDict)) {
        errorCountsDict[key] = {};
      }
      errorCountsDict[key][date] = val;
    }
  }
  return res.json(errorCountsDict);
}

module.exports = { getTimeGrammarCounts };
