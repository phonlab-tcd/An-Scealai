const mongoose = require('mongoose');

let Event = new mongoose.Schema({
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
      'PROFILE-STATS',
      'FEATURE-STATS',
    ],
  },
  storyData: Object,
  userId: String,
  statsData: Object,
}, {
  collection: 'engagement',
});

module.exports = mongoose.model('Event', Event);
