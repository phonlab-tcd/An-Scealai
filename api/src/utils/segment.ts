import winkNLP from 'wink-nlp';
import model from 'wink-eng-lite-web-model';
import normalizeWhitespace from "./normalize-whitespace";
const nlp = winkNLP(model);

export function segment(text) {
  const textClean = normalizeWhitespace(text);
  const tokens = nlp.readDoc(textClean).sentences().out();
  return tokens;
}
