const mongoose = require('mongoose');

const PlaySynthesis = new mongoose.Schema({
  ownerId: mongoose.Types.ObjectId,
  voice: String,
  text: String,
  speed: Number
}, {
  collection: 'engagement.playSynthesis',
  timestamps: true,
});

module.exports = mongoose.model('PlaySynthesis', PlaySynthesis);