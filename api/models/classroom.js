const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Classroom = new Schema({
  teacherId: String,
  title: String,
  date: Date,
  studentIds: [String],
  code: String,
  grammarRules: [String],
  grammarCheckers: [String],
}, {
  collection: 'classroom',
});

module.exports = mongoose.model('Classroom', Classroom);
