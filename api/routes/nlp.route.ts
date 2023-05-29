const makeEndpoints = require('../utils/makeEndpoints');

export = makeEndpoints({
    post: {
      '/tokenize': require('../endpoints_functions/nlp/tokenize'),
      '/sentenceTokenize': require('../endpoints_functions/nlp/sentence_tokenize').default,
      '/bong': require('../endpoints_functions/nlp/bong')
    },
  });