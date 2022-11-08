const makeEndpoints = require('../utils/makeEndpoints');

let nlpRoutes;
(() => {
  nlpRoutes = makeEndpoints({
    post: {
      '/tokenize': require('../endpoints_functions/nlp/tokenize'),
      '/sentenceTokenize': require('../endpoints_functions/nlp/sentence_tokenize'),
      '/bong': require('../endpoints_functions/nlp/bong')
    },
  });
})();

module.exports = nlpRoutes;