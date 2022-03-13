const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const path = require('path');


const DescribeGame = new Schema({
  ownerId: mongoose.ObjectId,
  public: Boolean,
  published: Boolean,
  recipients: [mongoose.ObjectId],
  audioMessages: [mongoose.ObjectId],
  imagePath: String,
  time: {
    type: {
      started: {
        type: Date,
        required: true,
      },
      finished: {
        type: Date,
        default: null,
      },
    }
  }
}, {
  collection: 'description.game.describe.game',
});

// const AudioMessage = new Schema({
//     ownerId: mongoose.ObjectId,
//     public: Boolean,
//     recipients: [mongoose.ObjectId],
//     mimetype: String,
// }, {
//     collection: 'description.game.audio.message'
// });
// 
// AudioMessage.methods.path = function () {
//   if(!this || !this.ownerId || !this._id || !this.mimetype)
//     return null;
//   return path.join(
//     __dirname,
//     '..',
//     'audioMessages',
//     this.ownerId.toString(),
//     ''.concat(this._id, '.', this.mimetype.split('/')[1]));
// };
// 
// AudioMessage.methods.uriPrefix = function () {
//   if(!this || !this.mimetype)
//     return null;
//   return `data:${this.mimetype};base64,`;
// };
// 
// AudioMessage.methods.forFrontend = function () {
//   return {
//     _id: this._id,
//     mimetype: this.mimetype,
//     uriPrefix: this.uriPrefix(),
//   };
// };

module.exports = mongoose.model('DescribeGame', DescribeGame);
