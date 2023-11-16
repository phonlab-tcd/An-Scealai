const mongoose = require('mongoose');

const Event = new mongoose.Schema({
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
      'DELETE-CLASSROOM',
      'USE-PROMPT-GENERATOR',
      'USE-DICTOGLOSS'
    ],
  },
  data: Object,
  owner: mongoose.Types.ObjectId,
}, {
  collection: 'engagement',
  timestamps: true,
});

module.exports = mongoose.model('Event', Event);
