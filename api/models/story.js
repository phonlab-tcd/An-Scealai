const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Story = new Schema({
    id: {
        type: String
    },
    title: {
        type: String
    },
    date: {
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
    }
}, {
    collection: 'story'
});

module.exports = mongoose.model('Story', Story);