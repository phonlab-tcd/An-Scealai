"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var TeacherCode = new Schema({
    code: {
        type: String
    },
}, {
    collection: 'teacherCodes'
});
module.exports = mongoose.model('TeacherCode', TeacherCode);
