const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Classroom = new Schema({
    teacherId: String,
    title: String,
    studentIds: [String],
    code: String
}, {
    collection: 'classroom'
});

module.exports = mongoose.model('Classroom', Classroom);