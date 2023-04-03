var mongoose = require('mongoose');

const promptSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    index: true,
  },
  level: {
    type: String,
    default: null,
    required: false,
  },
  dialect: {
    type: String,
    default: null,
    required: false,
  },
  partOfSpeech: {
    type: String,
    default: null,
    required: false,
  },
  prompt: {
    type: String,
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: null,
  },
});


module.exports = mongoose.model('Prompt', promptSchema);
