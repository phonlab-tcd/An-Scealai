var mongoose = require('mongoose');

const promptSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    index: true,
  },
  prompt: {
    type: String,
    unique: true,
  },
  level: {
    type: String,
    required: false,
  },
  dialect: {
    type: String,
    required: false,
  },
  partOfSpeechData: {
    type: Object,
    required: false,
    index: true,
    partOfSpeech: {
      type: String,
      required: false
    },
    word: {
      type: String,
      required: false,
      unique: true,
      index: true
    },
    translation: {
      type: String,
      required: false
    },
  },
  lastUpdated: {
    type: Date,
  },
},
{
  collection: 'promptData'
});


module.exports = mongoose.model('Prompt', promptSchema);
