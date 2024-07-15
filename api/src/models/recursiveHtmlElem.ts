const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecursiveHtmlElem = new Schema({
  _type : {
    type: String
  }
});

RecursiveHtmlElem.add({
  _type : {
    type: String
  },
  attrs : {
    '.' : String,
    '#' : String,
    'src' : String,
    'lemma' : String,
    'tags' : String,
  },
  '>' : [RecursiveHtmlElem]
})

export = RecursiveHtmlElem;