const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const path = require('path');

const AudioMessage = new Schema({
    ownerId: mongoose.ObjectId,
    public: Boolean,
    reciptients: [mongoose.ObjectId],
    mimetype: String,
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

module.exports = mongoose.model('AudioMessage', AudioMessage);
