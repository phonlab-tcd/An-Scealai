const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuillHighlightTag = new Schema({
  start: { type: Number }, 
  length: { type: Number },
  type: { type: String },
  messages: { 
    type: {
      en: { type: String },
      ga: { type: String }
    }
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
  collection: 'gramadoir.cache'
});

const GramadoirCacheLink = new Schema({
  gramadoirCacheId: {
    type: mongoose.ObjectId,
  },
  timestamp: {
    type: Date,
  }
});


const GramadoirStoryHistory = new Schema({
    userId: {
      type: mongoose.ObjectId,
    },
    storyId: {
      type: mongoose.ObjectId,
    },
    versions: {
      type: [GramadoirCacheLink],
      default: [],
    },
}, {
    collection: 'gramadoir.story.history'
});

module.exports = {
  GramadoirCache: mongoose.model('GramadoirCache', GramadoirCache),
  GramadoirStoryHistory: mongoose.model('GramadoirInputText', GramadoirStoryHistory),
}
