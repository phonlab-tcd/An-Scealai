const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Message = new Schema({
  id: {
    type: String,
  },
  subject: {
    type: String,
  },
  date: {
    type: Date,
  },
  senderId: {
    type: String,
  },
  senderUsername: {
    type: String,
  },
  recipientId: {
    type: String,
  },
  text: {
    type: String,
  },
  seenByRecipient: {
    type: Boolean,
  },
  audioId: {
    type: String,
  },

}, {
  collection: 'messages',
});

module.exports = mongoose.model('Message', Message);
