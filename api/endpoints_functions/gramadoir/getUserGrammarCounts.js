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

  return res.json(filteredData);
}

module.exports = {getUserGrammarCounts};
