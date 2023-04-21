const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
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

// Chatbot logs
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


// Chatbot object
let Chatbot = new Schema({
  username: { type: String },
  _id: { type: String },
  role: { type: String },
  logs: [Log],
},
  {
    collection: 'chatbot'
  },
);


// Schema for audio bubbles
let AudioBubble = new Schema({
  text: { type: String },
  dialect: { type: String }
});


// Schema for Quizes by the community
let CommunityScript = new Schema({
  name: { type: String },
  content: { type: String },
  user: { type: String }, 
},
 {
   collection: 'communityScripts'
 },
);

var CommunityScriptModel = mongoose.model('CommunityScripts', CommunityScript);

// Schema for Quizes the user creates
const ChatbotUserQuiz = new Schema(
    {
      owner: {
        type: mongoose.Types.ObjectId,
        index: true,
      },
      title: {
        type: String,
      },
      date: {
        type: Date,
      },
      classroomId: {
        type: ObjectId,
        index: true,
      },
      numOfQuestions: {
        type: Number,
      },
      botScript: {
        type: String,
      },
      content: {
        type: String,
      },
    },
    {
      collection: 'chatbotUserQuizzes',
    },
);

module.exports = {
  ChatbotUserQuiz: mongoose.model('ChatbotUserQuiz', ChatbotUserQuiz),
  Log: mongoose.model('Log', Log),
  Chatbot: mongoose.model('Chatbot', Chatbot),
  AudioBubble: mongoose.model('AudioBubble', AudioBubble),
  CommunityScript: mongoose.model('CommunityScript', CommunityScript),
};
