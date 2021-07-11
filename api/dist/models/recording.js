"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var VoiceRecording = new Schema({
    date: Date,
    storyData: Object,
    paragraphAudioIds: [String],
    paragraphIndices: [Number],
    sentenceAudioIds: [String],
    sentenceIndices: [Number],
    archived: Boolean
}, {
    collection: 'recordings'
});
module.exports = mongoose.model('VoiceRecording', VoiceRecording);
