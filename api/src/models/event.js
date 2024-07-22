const mongoose = require('mongoose');

const Event = new mongoose.Schema({
  ownerId: mongoose.Types.ObjectId,
  type: {
    type: String,
    enum: [
      'REGISTER',
      'LOGIN',
      'LOGOUT',
      'CREATE-STORY',
      'DELETE-STORY',
      'VIEW-FEEDBACK',
      'USE-DICTIONARY',
      'USE-GRAMMAR-CHECKER',
      'RECORD-STORY',
      'CREATE-MESSAGE',
      'USE-PROMPT-GENERATOR',
      'USE-DICTOGLOSS',
      'DELETE-CLASSROOM',
      'PROFILE-STATS',
      'FEATURE-STATS',
      'CREATE-DR-STORY',
    ],
    required: true
  },
  data: {
    type: Object,
    required: false
  },
}, {
  collection: 'engagement',
  timestamps: true,
});

module.exports = mongoose.model('Event', Event);
