import { tokenizeHandler } from  "./sentence_tokenize";
import { expect } from "@jest/globals";
// import {API400Error} from '../../utils/APIError';

// const winkNLP = require('wink-nlp');
// const model = require('wink-eng-lite-web-model');
// const nlp = winkNLP(model);

// // tokenise story text into sentences
// module.exports = async (req, res) => {
//   if (!req.body.text) throw new API400Error('Must include text parameter in the request body.');
//   const text = Buffer.from(req.body.text, 'utf-8').toString();
//   console.log(req.body.text);
//   console.log(text);
//   const tokens = nlp.readDoc(text).sentences().out();
//   console.log(tokens);
//   res.json(tokens);
  
// }

function string_equals(input, expectedOutput) {
  let output;
  const res = {
    json: (tokens) => {
      output = tokens;
      expect(tokens[0].length).toEqual(expectedOutput.length)
    }
  };
  const req = {
    body: {
      text: input,
    }
  };
  tokenizeHandler(req,res);
  return output[0];

}

function unicode(s) {
  return JSON.stringify(s);
}

const whitespaces = {
  "no break whitespace": "\u00A0",
  "ogham space mark": "\u1680",
  "mongolian vowel separtor": "\u180E",
  "zero width no-break space": "\uFEFF",
  "ideographic space": "\u3000",
  "narrow no-break space": "\u202F",
  "EN QUAD": "\u2000",
  "EM QUAD": "\u2001",
  "EN SPACE (nut)": "\u2002",
  "EM SPACE (mutton)": "\u2003",
  "THREE-PER-EM SPACE": "\u2004",
  "FOUR-PER-EM SPACE (mid space)": "\u2005",
  "SIX-PER-EM SPACE": "\u2006",
  "FIGURE SPACE": "\u2007",
  "PUNCTUATION SPACE": "\u2008",
  "THIN SPACE": "\u2009",
  "HAIR SPACE": "\u200A",
  "ZERO WIDTH SPACE": "\u200B",
};

describe("sentence tokenization",()=>{
  for(const [name, char] of Object.entries(whitespaces)) {
    it(`handles ${name}  >>${char}<< i.e. ${unicode(char)}`,()=>{
      const input = `mo${char}madra`;
      const expectedOutput = "mo madra";
      string_equals(input, expectedOutput);
    })
  }

});
