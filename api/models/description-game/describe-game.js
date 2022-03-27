const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const path = require('path');


const DescribeGame = new Schema({
  ownerId: { type: mongoose.ObjectId, ref: 'User' },
  public: Boolean,
  published: Boolean,
  recipients: {
    type: Array,
    of: { type: mongoose.ObjectId, ref: 'User' },
  },
  audioMessages: {
    type: Array,
    of: { type: mongoose.ObjectId, ref: 'AudioMessage' },
  },
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

const DescriptionTarget = new Schema({
  path: String,
  exists: { type: Boolean, default: false },
  existenceCheckedAt: { type: Date, default: null },
}, {
  collection: 'description.game.description.target',
});

module.exports = mongoose.model('DescribeGame', DescribeGame);
