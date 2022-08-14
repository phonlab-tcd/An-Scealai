const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Story = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    feedback: {
      text: {
        type: String,
        default: null,
      },
      seenByStudent: {
        type: Boolean,
        default: null,
      },
      audioId: {
        type: String,
        default: null,
      },
    },
    activeRecording: {
      type: String,
    },
  },
  {
    collection: "story",
  }
);

module.exports = mongoose.model("Story", Story);
