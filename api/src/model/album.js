const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Recording = new Schema({
    text : { type: String },
    cachedData : { type: Object },
    audioId : { type: String },
});

let Album = new Schema({
    title: {type: String},
    date: {type: Date},
    userId: {type: String},
    recordings: [Recording],
}, {
    collection: 'album'
});

let AlbumModel = mongoose.model('Album', Album);
let RecordingModel = mongoose.model('Recording', Recording);

module.exports = {
    Album : AlbumModel,
    Recording : RecordingModel
}