const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const FeedbackComment = new Schema(
  {
    text: { type: String, required: false },
    audioId: { type: String, required: false },
    range: {
      type: {
        index: { type: Number, required: false },
        length: { type: Number, required: false },
      },
    },
    storyId: {
      type: mongoose.Types.ObjectId,
      index: true,
    },
    lastUpdated: { type: Date, required: true },
  },
  {
    collection: "feedbackComment",
  }
);

export = mongoose.model("Feedback", FeedbackComment);
