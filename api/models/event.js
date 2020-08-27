const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Event = new Schema({
    date: Date,
    type: {
        type: String,
        enum: [
            'CREATE-STORY', 
            'DELETE-STORY', 
            'SAVE-STORY', 
            'SYNTHESISE-STORY', 
            'GRAMMAR-CHECK-STORY',
            'REGISTER',
            'LOGIN',
            'LOGOUT',
            'VIEW-FEEDBACK',
            'CREATE-MESSAGE',
            'RECORD-STORY',
        ],
    },
    storyData: Object,
    userId: String,
    addedToHistory: Boolean,
    paragraphAudioIds: {
        type: Map,
        of: [String],
        default: {}
    },
    sentenceAudioIds: {
        type: Map,
        of: String,
        default: {}
    },
}, {
    collection: 'engagement'
});

module.exports = mongoose.model('Event', Event);