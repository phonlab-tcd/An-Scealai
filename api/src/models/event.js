const mongoose = require('mongoose');

const Event = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      'CREATE-STORY',
      'DELETE-STORY',
      'SYNTHESISE-STORY',
      'GRAMMAR-CHECK-STORY',
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
  ownerId: mongoose.Types.ObjectId,
}, {
  collection: 'engagement',
  timestamps: true,
});

module.exports = mongoose.model('Event', Event);
