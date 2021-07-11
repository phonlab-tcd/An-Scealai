"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Recording = new Schema({
    text: { type: String },
    cachedData: { type: Object },
    audioId: { type: String },
});
var Album = new Schema({
    title: { type: String },
    date: { type: Date },
    userId: { type: String },
    recordings: [Recording],
}, {
    collection: 'album'
});
var AlbumModel = mongoose.model('Album', Album);
var RecordingModel = mongoose.model('Recording', Recording);
module.exports = {
    Album: AlbumModel,
    Recording: RecordingModel
};
