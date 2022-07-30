const mongoose = require('mongoose');

const props = {
  user: String,
  date: Date,
  voice: Object,
  text: String,
  user: Object,
};
const collection = 'engagement.playSynthesis';
const PlaySynthesis = new mongoose.Schema(props, {collection: collection});

module.exports = mongoose.model(collection, PlaySynthesis);
