import t from './translation';

const en = t.languages[0];
const ga = t.languages[1];

const x = {};

for(const k of Object.keys(en)) {
  x[k] = {
    ga: ga[k],
    en: en[k],
  }
}
console.dir(x);
