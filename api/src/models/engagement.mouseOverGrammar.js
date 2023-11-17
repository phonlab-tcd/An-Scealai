const mongoose = require("mongoose");

const MouseOverGrammarErrorEvent = new mongoose.Schema(
  {
    ownerId: mongoose.Types.ObjectId,
    grammarSuggestionData: Object,
  },
  {
    collection: "engagement.mouseOverGrammarError",
    timestamps: true,
  }
);

module.exports = mongoose.model( "MouseOverGrammarErrorEvent", MouseOverGrammarErrorEvent );
