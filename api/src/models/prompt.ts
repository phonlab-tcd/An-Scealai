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
  timestamps: true,
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
  timestamps: true,
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
  timestamps: true,
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
  timestamps: true,
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
  timestamps: true,
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
  timestamps: true,
});


export default {
  GeneralPromptSchema: mongoose.model('GeneralPromptSchema', GeneralPromptSchema),
  ProverbPromptSchema: mongoose.model('ProverbPromptSchema', ProverbPromptSchema),
  ExamPromptSchema: mongoose.model('ExamPromptSchema', ExamPromptSchema),
  LARAPromptSchema: mongoose.model('LARAPromptSchema', LARAPromptSchema),
  CombinationPromptSchema: mongoose.model('CombinationPromptSchema', CombinationPromptSchema),
  POSPromptSchema: mongoose.model('POSPromptSchema', POSPromptSchema)
};
