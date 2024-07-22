const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecursiveHtmlElem = new Schema({
  type : {
    type: String
  },
  attrs : {
    'class' : String,
    '#' : String,
    'src' : String,
    'lemma' : String,
    'tags' : String,
  }
});

RecursiveHtmlElem.add({
  '>' : {
    type: [RecursiveHtmlElem],
    default: undefined
  }
})

export = RecursiveHtmlElem;