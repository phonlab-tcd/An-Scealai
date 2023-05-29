import winkNLP from 'wink-nlp';
import model from 'wink-eng-lite-web-model';
const nlp = winkNLP(model);

function mk_whitespace_regex(){
  const whitespace_names = {
    "no break whitespace": "\u00A0",
    "ogham space mark": "\u1680",
    //"mongolian vowel separtor": "\u180E",
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
    //"ZERO WIDTH SPACE": "\u200B",
  };
  const whitespaces_concat = Object.values(whitespace_names).join("");
  const whitespace_regex = new RegExp("[" + whitespaces_concat + "]", "g");
  return whitespace_regex;
}

const whitespaces = mk_whitespace_regex();
export function segment(text) {
  const textClean = text.replace(whitespaces, " ");
  const tokens = nlp.readDoc(textClean).sentences().out();
  return tokens;
}
