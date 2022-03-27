const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const path = require('path');

const AudioMessage = new Schema({
  ownerId: mongoose.ObjectId,
  public: Boolean,
  reciptients: [mongoose.ObjectId],
  mimetype: String,
  time: {
    start: Number,
    stop: Number,
    ready: Number,
  }
}, {
    collection: 'description.game.audio.message'
});

AudioMessage.methods.path = function () {
  if(!this || !this.ownerId || !this._id || !this.mimetype)
    return null;
  return path.join(
    __dirname,
    '..',
    'audioMessages',
    this.ownerId.toString(),
    ''.concat(this._id, '.', this.mimetype.split('/')[1]));
};

AudioMessage.methods.uriPrefix = function () {
  if(!this || !this.mimetype)
    return null;
  return `data:${this.mimetype};base64,`;
};

AudioMessage.statics.uriPrefixStatic = function (am) {
  if(!am || !am.mimetype)
    return null;
  return `data:${am.mimetype};base64,`;
};

AudioMessage.methods.forFrontend = function () {
  return {
    _id: this._id,
    mimetype: this.mimetype,
    uriPrefix: this.uriPrefix(),
  };
};

module.exports = mongoose.model('AudioMessage', AudioMessage);
module.exports.schema = AudioMessage;
