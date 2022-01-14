const makeEndpoints = require('../utils/makeEndpoints');
const synthesiseSingleSentenceDNN =
  require('../endpoints_functions/synth/singleSentenceDNN');

module.exports = makeEndpoints({
    get: {
      '/singleSentenceDNN': synthesiseSingleSentenceDNN,
    },
  });
