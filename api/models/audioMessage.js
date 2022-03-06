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
  if(!this)
    throw new Error('document does not exist yet');
  if(!this.ownerId)
    throw new Error('dir must be defined to derive path');
  if(!this._id)
    throw new Error('_id must be defined to derive path');
  if(!this.mimetype)
    throw new Error('mimetype must be defined to derive path');
  return path.join(
    __dirname,
    '..',
    'audioMessages',
    this.ownerId.toString(),
    ''.concat(this._id, '.', this.mimetype.split('/')[1]));
};

module.exports = mongoose.model('AudioMessage', AudioMessage);
