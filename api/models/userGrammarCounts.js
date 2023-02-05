const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserGrammarCounts = new Schema({
  errorCounts: {
    type: Object,
  },
  newCounts: {
    type: Object,
  },
  owner: {
    type: mongoose.ObjectId,
    index: true,
  },
}, {
  collection: 'userGrammarCounts',
  timestamps: true,
});

module.exports = mongoose.model('UserGrammarCounts', UserGrammarCounts);
