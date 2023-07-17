const makeEndpoints = require('../utils/makeEndpoints');

export = makeEndpoints({
    post: {
      '/tokenize': require('../endpoint/nlp/tokenize'),
      '/sentenceTokenize': require('../endpoint/nlp/sentence_tokenize').default,
      '/bong': require('../endpoint/nlp/bong')
    },
  });