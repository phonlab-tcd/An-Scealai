import RecursiveHtmlElem from "./recursiveHtmlElem";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DigitalReaderStory = new Schema(
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
      //dialects: {
      collections: {
        type: Array, // possibility for multiple dialects
      },
      story :
        {
          content: {
            type : RecursiveHtmlElem,
          },
          sentences : {
            type: Schema.Types.Mixed, // obj of key-value pairs
          },
          words : {
            type: Schema.Types.Mixed, // obj of key-value pairs
          }
        }, // body element
        public: {
          type: Boolean
        }
    },
    {
      collection: 'drStory',
      timestamps: true
    },
);

export = mongoose.model('DigitalReaderStory', DigitalReaderStory);
