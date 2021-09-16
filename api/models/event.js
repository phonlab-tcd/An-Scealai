const mongoose = require('mongoose');

const Event = new mongoose.Schema({
  date: Date,
  type: {
    type: String,
    enum: [
      'CREATE-STORY',
      'DELETE-STORY',
      'SAVE-STORY',
      'SYNTHESISE-STORY',
      'GRAMMAR-CHECK-STORY',
      'MOUSE-OVER-GRAMMAR-SUGGESTION',
      'REGISTER',
      'LOGIN',
      'LOGOUT',
      'VIEW-FEEDBACK',
      'CREATE-MESSAGE',
      'RECORD-STORY',
      'USE-DICTIONARY',
    ],
  },
  storyData: Object,
  userId: String,
}, {
  collection: 'engagement',
});

module.exports = mongoose.model('Event', Event);
