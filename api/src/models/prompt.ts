const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GeneralPromptSchema = new Schema({
  prompt: {
    type: String,
    required: true,
  },
  lastUpdated: {
    type: Date,
  },
}, {
  collection: 'prompt.general',
});

const ProverbPromptSchema = new Schema({
  prompt: {
    type: String,
    required: true,
  },
  translation: {
    type: String,
    required: true,
  },
  dialect: {
    type: String,
    enum: ["munster", "connacht", "ulster"],
    required: true,
  },
  lastUpdated: {
    type: Date,
  },
}, {
  collection: 'prompt.proverb',
});

const ExamPromptSchema = new Schema({
  prompt: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    enum: ["jc", "ol", "hl"],
    required: true,
  },
  lastUpdated: {
    type: Date,
  },
}, {
  collection: 'prompt.exam',
});

const LARAPromptSchema = new Schema({
  prompt: {
    type: String,
    required: true,
  },
  storyTitle: {
    type: String,
    required: true,
  },
  lastUpdated: {
    type: Date,
  },
}, {
  collection: 'prompt.lara',
});

const CombinationPromptSchema = new Schema({
  prompt: {
    type: String,
    required: true,
  },
  translation: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    enum: ["character", "location", "theme"],
    required: true,
  },
  level: {
    type: String,
    enum: ["primary", "secondary", "tertiary"],
    required: true,
  },
  lastUpdated: {
    type: Date,
  },
}, {
  collection: 'prompt.combination',
});

const POSPromptSchema = new Schema({
  word: {
    type: String,
    required: true,
  },
  translation: {
    type: String,
    required: true,
  },
  partOfSpeech: {
    type: String,
    enum: ["noun", "verb", "adjective", "preposition", "adverb", "pronoun", "article", "conjunction"],
    required: true,
  },
  lastUpdated: {
    type: Date,
  },
}, {
  collection: 'prompt.partOfSpeech',
});


export default {
  GeneralPromptSchema: mongoose.model('GeneralPromptSchema', GeneralPromptSchema),
  ProverbPromptSchema: mongoose.model('ProverbPromptSchema', ProverbPromptSchema),
  ExamPromptSchema: mongoose.model('ExamPromptSchema', ExamPromptSchema),
  LARAPromptSchema: mongoose.model('LARAPromptSchema', LARAPromptSchema),
  CombinationPromptSchema: mongoose.model('CombinationPromptSchema', CombinationPromptSchema),
  POSPromptSchema: mongoose.model('POSPromptSchema', POSPromptSchema)
};
