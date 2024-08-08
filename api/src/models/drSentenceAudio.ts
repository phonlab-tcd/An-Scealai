const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DigitalReaderSentenceAudio = new Schema(
    {
      drStoryId: {
        type: mongoose.Types.ObjectId,
        index: true,
      },
      sentenceId: {
        type: Number,
      },
      voice: {
        type: String,
      },
      timing: {
        type: Array,
      },
      audioUrl: {
        type: String,
      },
    },
    {
      collection: 'drSentenceAudio',
      timestamps: true
    },
);

export = mongoose.model('DigitalReaderSentenceAudio', DigitalReaderSentenceAudio);
