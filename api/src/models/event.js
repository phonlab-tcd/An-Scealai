const mongoose = require('mongoose');

const Event = new mongoose.Schema({
  type: {
    ownerId: mongoose.Types.ObjectId,
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
}, {
  collection: 'engagement',
  timestamps: true,
});

module.exports = mongoose.model('Event', Event);
