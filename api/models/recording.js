const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let VoiceRecording = new Schema({
  date: Date,
  storyData: Object,
  userId: String,
  addedToHistory: Boolean,
  paragraphAudioIds: {
      type: Map,
      of: [String],
      default: {}
  },
  sentenceAudioIds: {
      type: Map,
      of: String,
      default: {}
  },
}, {
    collection: 'recordings'
});

module.exports = mongoose.model('VoiceRecording', VoiceRecording);