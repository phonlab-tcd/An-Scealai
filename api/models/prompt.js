var mongoose = require('mongoose');

const promptSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  prompt: {
    type: Object,
    unique: true,
    topic: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: false,
    },
    dialect: {
      type: String,
      required: false,
    },
    text: {
      type: String,
      required: false,
    },
    combinationData: {
      type: Object,
      required: false,
      character: {
        type: String,
        required: false,
      },
      setting: {
        type: String,
        required: false,
      },
      theme: {
        type: String,
        required: false,
      },
    },
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
