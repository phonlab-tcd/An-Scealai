const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Story = new Schema({
    title: {
        type: String
    },
    date: {
        type: Date
    },
    lastUpdated: {
      type: Date
    },
    dialect: {
        type: String
    },
    text: {
        type: String
    },
    author: {
        type: String
    },
    studentId: {
        type: String
    },
    feedback: {
        text: {
            type: String
        },
        seenByStudent: {
            type: Boolean
        },
        audioId: {
            type: String
        }
    },
    activeRecording: {
        type: String
    }
}, {
    collection: 'story'
});

module.exports = mongoose.model('Story', Story);
