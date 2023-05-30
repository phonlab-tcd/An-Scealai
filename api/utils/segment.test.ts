import { segment } from "./segment";
import { describe, it, expect } from "@jest/globals";

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
        const input = `mo${char}mhadra`;
        expect(input.length).toStrictEqual(segment(input)[0].length);
      })
    }
  });