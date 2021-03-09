const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VoiceRecording = new Schema({
  date: Date,
  storyData: Object,
  paragraphAudioIds: [String],
  paragraphIndices: [Number],
  sentenceAudioIds: [String],
  sentenceIndices: [Number]
}, {
    collection: 'recordings'
});

module.exports = mongoose.model('VoiceRecording', VoiceRecording);