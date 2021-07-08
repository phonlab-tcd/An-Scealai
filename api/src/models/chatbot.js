// Chatbot.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Chatbot
let Message = new Schema({
  date: { type: Date },
  isUser: { type: Boolean },
  text: { type: String },
},
  {
    versionKey: false
  }
);

let Log = new Schema({
  date: { type: Date },
  topic: { type: String },
  complete: { type: Boolean },
  conversation: [Message],
},
  {
    versionKey: false
  }
);

var LogModel = mongoose.model('Log', Log);

let Chatbot = new Schema({
  username: { type: String },
  _id: { type: String },
  role: { type: String },
  logs: [Log],
},
  {
    collection: 'chatbot'
  },
  {
    __v: {
      type: Number,
      select: false
    }
  }
);

var ChatbotModel = mongoose.model('Chatbot', Chatbot);
//module.exports = mongoose.model('Chatbot', Chatbot);

let AudioBubble = new Schema({
  text: { type: String },
  dialect: { type: String }
});

var AudioBubbleModel = mongoose.model('AudioBubble', AudioBubble)
module.exports = {
  Log: LogModel,
  Chatbot: ChatbotModel,
  AudioBubble: AudioBubbleModel
}
