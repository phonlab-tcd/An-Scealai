const mongoose = require('mongoose');
const UserGrammarCounts = require('../../models/userGrammarCounts');
const {API500Error} = require('../../utils/APIError');

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
