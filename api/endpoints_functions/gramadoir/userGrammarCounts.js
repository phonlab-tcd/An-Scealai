const mongoose = require('mongoose');
const UserGrammarCounts = require('../../models/userGrammarCounts');
const {API500Error} = require('../../utils/APIError');


// Get set of new errors from frontend client (frontend has to determine which errors are new and which are old).
// Create a new document with the counts of these errors by type (e.g. GENITIVE, BACHOIR, NISEIMHIU, etc.).
// To get the total counts of errors for a user, would have to scan the collection by the owner and collate documents,
// which is delegated to another part of the code base for simplicity/efficiency.
module.exports = async (req, res, next) => {
  const userId = new mongoose.mongo.ObjectId(req.user._id);

  const errorDict = req.body.errors.reduce(function(prev, cur) {
    prev[cur] = (prev[cur] || 0) + 1;
    return prev;
  }, {});

  const errorLog = await UserGrammarCounts.create({owner: userId, timestamp: new Date(), errorCounts: errorDict});
  if (!errorLog) {
    throw new API500Error('Unable to save error counts to DB.');
  }
  res.status(200).json({});
};
