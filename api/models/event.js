const mongoose = require('mongoose');
const { Schema } = mongoose;

const enum_array = Object.freeze([
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
]);

let EventEnum = {
  type: String,
  enum: enum_array,
};

let Event = new Schema({
  date: Date,
  type: EventEnum,
  storyData: Object,
  userId: String,
  statsData: Object,
}, {
  collection: 'engagement',
});

module.exports = mongoose.model('Event', Event);
module.exports.EventEnum = EventEnum; 
