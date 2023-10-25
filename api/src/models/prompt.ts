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
    required: false,
  },
  dialect: {
    type: String,
    enum: ["Munster", "Connaught", "Ulster"],
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
    enum: ["junior-cert", "ordinary-level", "higher-level"],
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
    required: true,
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
  collection: 'prompt.pos',
});

const promptSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  prompt: {
    type: Object,
    unique: true,
    topic: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: false,
    },
    dialect: {
      type: String,
      required: false,
    },
    text: {
      type: String,
      required: false,
    },
    combinationData: {
      type: Object,
      required: false,
      character: {
        type: String,
        required: false,
      },
      setting: {
        type: String,
        required: false,
      },
      theme: {
        type: String,
        required: false,
      },
    },
  },
  partOfSpeechData: {
    type: Object,
    required: false,
    index: true,
    partOfSpeech: {
      type: String,
      required: false
    },
    word: {
      type: String,
      required: false,
      unique: true,
    },
    translation: {
      type: String,
      required: false
    },
  },
  lastUpdated: {
    type: Date,
  },
},
{
  collection: 'promptData'
});

export default {
  GeneralPromptSchema: mongoose.model('GeneralPromptSchema', GeneralPromptSchema),
  ProverbPromptSchema: mongoose.model('ProverbPromptSchema', ProverbPromptSchema),
  ExamPromptSchema: mongoose.model('ExamPromptSchema', ExamPromptSchema),
  LARAPromptSchema: mongoose.model('LARAPromptSchema', LARAPromptSchema),
  CombinationPromptSchema: mongoose.model('CombinationPromptSchema', CombinationPromptSchema),
  POSPromptSchema: mongoose.model('POSPromptSchema', POSPromptSchema),
  Prompt: mongoose.model('Prompt', promptSchema)
};
