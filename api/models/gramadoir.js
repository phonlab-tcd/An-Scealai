const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuillHighlightTag = new Schema({
  start: {type: Number, required: true},
  length: {type: Number, required: true},
  type: {type: String, required: true},
  messages: {
    type: {
      en: {type: String, required: true},
      ga: {type: String, required: true},
    },
  },
});

const GramadoirCache = new Schema({
  text: {
    type: String,
    unique: true,
  },
  grammarTags: {
    type: Array,
    of: QuillHighlightTag,
  },
}, {
  collection: 'gramadoir.cache',
});

const GramadoirCacheLink = new Schema({
  gramadoirCacheId: {
    type: mongoose.Types.ObjectId,
  },
  timestamp: {
    type: Date,
  },
});


const GramadoirStoryHistory = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
  },
  storyId: {
    type: mongoose.Types.ObjectId,
  },
  versions: {
    type: [GramadoirCacheLink],
    default: [],
  },
}, {
  collection: 'gramadoir.story.history',
});

module.exports = {
  GramadoirCache: mongoose.model('GramadoirCache', GramadoirCache),
  GramadoirStoryHistory: mongoose.model('GramadoirInputText', GramadoirStoryHistory),
};
