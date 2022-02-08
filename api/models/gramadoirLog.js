const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GramadoirInputText = new Schema({
  text: {
    type: String,
    unique: true,
  },
}, {
  collection: 'gramadoir.inputText'
});

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
});

const GramadoirTags = new Schema({
    studentId: {
      type: mongoose.ObjectId 
    },
    storyId: {
      type: mongoose.ObjectId
    },
    textId: {
      type: mongoose.ObjectId
    },
    grammarErrors: {
        type: Array,
        of: GramadoirTag
    },
    text: {
      type: mongoose.ObjectId,
    },
}, {
    collection: 'gramadoir.tags'
});

module.exports = {
  gramadoirTagsModel: mongoose.model('GramadoirTags', GramadoirTags),
  gramadoirIntputTextModel: mongoose.model('GramadoirInputText', GramadoirInputText),
}
