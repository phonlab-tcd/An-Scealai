const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TeacherCode = new Schema({
    code: {
        type: String
    },
}, {
    collection: 'teacherCodes'
});

module.exports = mongoose.model('TeacherCode', TeacherCode);