const mongoose = require('mongoose');

const SaveStoryEvent = new mongoose.Schema({
  storyObject: Object,
  ownerId: mongoose.Types.ObjectId,
}, {
  collection: 'engagement.saveStory',
  timestamps: true,
});

module.exports = mongoose.model('SaveStoryEvent', SaveStoryEvent);