const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const FeedbackComment = new Schema(
  {
    owner: { type: mongoose.Types.ObjectId },
    storyId: {
      type: mongoose.Types.ObjectId,
      index: true,
    },
    text: { type: String, required: false },
    audioId: { type: String, required: false },
    range: {
      type: {
        index: { type: Number, required: false },
        length: { type: Number, required: false },
      },
    },
    lastUpdated: { type: Date, required: true },
  },
  {
    collection: "feedbackComment",
  }
);

export = mongoose.model("Feedback", FeedbackComment);
