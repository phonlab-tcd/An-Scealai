const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let StudentStats = new Schema({
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
        of: Number,
        default: {}
    }
}, {
    collection: 'studentStats'
});

module.exports = mongoose.model('StudentStats', StudentStats);