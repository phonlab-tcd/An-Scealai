const mongoose = require('mongoose');

const SaveStoryEvent = new mongoose.Schema({
  ownerId: mongoose.Types.ObjectId,
  storyObject: Object,
}, {
  collection: 'engagement.saveStory',
  timestamps: true,
});

module.exports = mongoose.model('SaveStoryEvent', SaveStoryEvent);