const mongoose = require('mongoose');

const PlaySynthesis = new mongoose.Schema({
  ownerId: mongoose.Types.ObjectId,
  storyId: mongoose.Types.ObjectId,
  voice: Object,
  text: String,
}, {
  collection: 'engagement.playSynthesis',
  timestamps: true,
});

module.exports = mongoose.model('PlaySynthesis', PlaySynthesis);