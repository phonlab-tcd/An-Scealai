const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VoiceRecording = new Schema({
  date: Date,
  storyData: Object,
  paragraphAudioIds: [String],
  paragraphIndices: [Number],
  paragraphTranscriptions: [String],
  sentenceAudioIds: [String],
  sentenceIndices: [Number],
  sentenceTranscriptions: [String],
  archived: Boolean,
}, {
  collection: 'recordings',
});

export = mongoose.model('VoiceRecording', VoiceRecording);
