"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var StudentStats = new Schema({
    studentId: {
        type: String
    },
    classroomId: {
        type: String
    },
    studentUsername: {
        type: String
    },
    grammarErrors: {
        type: Map,
        of: [Number],
        default: {}
    },
    timeStamps: {
        type: Map,
        of: [Date],
        default: {}
    },
}, {
    collection: 'studentStats'
});
module.exports = mongoose.model('StudentStats', StudentStats);
