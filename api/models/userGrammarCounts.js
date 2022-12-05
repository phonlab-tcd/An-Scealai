const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserGrammarCounts = new Schema({
  errorCounts: {
    type: Object,
  },
  owner: {
    type: mongoose.ObjectId,
    index: true,
  },
  timestamp: {
    type: Date,
  },
}, {
  collection: 'userGrammarCounts',
});

module.exports = mongoose.model('UserGrammarCounts', UserGrammarCounts);
