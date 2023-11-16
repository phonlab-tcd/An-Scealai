const mongoose = require("mongoose");

const MouseOverGrammarErrorEvent = new mongoose.Schema(
  {
    grammarSuggestionData: Object,
    ownerId: mongoose.Types.ObjectId,
  },
  {
    collection: "engagement.mouseOverGrammarError",
    timestamps: true,
  }
);

module.exports = mongoose.model( "MouseOverGrammarErrorEvent", MouseOverGrammarErrorEvent );
