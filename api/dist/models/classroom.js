"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Classroom = new Schema({
    teacherId: String,
    title: String,
    date: Date,
    studentIds: [String],
    code: String,
    grammarRules: [String],
}, {
    collection: 'classroom'
});
module.exports = mongoose.model('Classroom', Classroom);
