const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Classroom = new Schema({
  teacherId: mongoose.Types.ObjectId,
  title: String,
  date: Date,
  studentIds: [String],
  code: String,
  grammarCheckers: [String],
}, {
  collection: 'classroom',
  timestamps: true
});

module.exports = mongoose.model('Classroom', Classroom);