const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StoryGrammarErrors = new Schema({
  sentences: {
    type: {
      errors: {
        type: {
          start: {type: Number, required: true},
          length: {type: Number, required: true},
          type: {type: String, required: true},
          tooltip: {type: String, required: false},
          messages: {
            type: {
              en: {type: String, required: true},
              ga: {type: String, required: true},
            },
          },
        },
        default: [],
      },
      sentence: {type: String, required: true},
    },
  },
  owner: {
    type: mongoose.ObjectId,
  },
  storyId: {
    type: mongoose.ObjectId,
  },
  timestamp: {
    type: Date,
  },
}, {
  collection: 'storygrammarerrors',
});

module.exports = mongoose.model('StoryGrammarErrors', StoryGrammarErrors);
