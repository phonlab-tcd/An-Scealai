const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Story = new Schema(
    {
      owner: {
        type: mongoose.Types.ObjectId,
        index: true,
        // required: true, // TODO, make required
        // ref: 'User', // TODO, validate relation to users collection
      },
      title: {
        type: String,
      },
      date: {
        type: Date,
      },
      lastUpdated: {
        type: Date,
      },
      dialect: {
        type: String,
      },
      text: {
        type: String,
      },
      htmlText: {
        type: String,
      },
      author: {
      // DEPRECATED
        type: String,
      },
      studentId: {
      // DEPRECATED
        type: String,
      },
      feedback: {
        // DEPRECATED
        text: {
          type: String,
          default: null,
        },
        seenByStudent: {
          type: Boolean,
          default: null,
        },
        // DEPRECATED
        audioId: {
          type: String,
          default: null,
        },
        feedbackMarkup: {
          type: String,
          default: null,
        },
        hasComments: {
          type: Boolean,
          default: false,
        },
        lastUpdated: {
          type: Date,
          default: null,
        },
      },
      activeRecording: {
        type: String,
      },
      createdWithPrompts: {
        type: Boolean,
      },
      timeSpentOnStory: {
        type: Number,
      },
    },
    {
      collection: 'story',
    },
);

export = mongoose.model('Story', Story);
