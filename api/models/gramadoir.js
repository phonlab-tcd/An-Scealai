const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GramadoirTag = new Schema({
  fromy: { type: Number },
  fromx: { type: Number },
  toy: { type: Number },
  tox: { type: Number },
  ruleId: { type: String },
  msg: { type: String },
  context: { type: String },
  contextoffset: { type: Number },
  errortext: { type: String },
  errorlength: { type: Number },
  messages: {
    type: {
      ga: { type: String },
      en: { type: String },
    },
  }
});

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
