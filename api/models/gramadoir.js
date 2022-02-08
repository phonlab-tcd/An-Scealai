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

const GramadoirStoryHistory = new Schema({
    ownerId: {
      type: mongoose.ObjectId,
    },
    storyId: {
      type: mongoose.ObjectId,
    },
    versions: {
      type: Array,
      of: {
        gramadoirCacheId: {
          type: mongoose.ObjectId,
        },
        timestamp: {
          type: Date,
        }
      }
    }
}, {
    collection: 'gramadoir.story.history'
});

module.exports = {
  GramadoirCache: mongoose.model('GramadoirCache', GramadoirCache),
  GramadoirStoryHistory: mongoose.model('GramadoirInputText', GramadoirStoryHistory),
}
