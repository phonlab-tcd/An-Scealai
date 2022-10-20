import {API400Error} from '../../utils/APIError';

const NLPUtils = require('wink-nlp-utils');

// Generates a map of { ngrams -> frequencies }
module.exports = async (req, res) => {
  if (!req.body.array) throw new API400Error('Must include array parameter in the request body.');
  if (!req.body.n) throw new API400Error('Must include n parameter in the request body.');
  const ngrams = NLPUtils.string.bong(req.body.array, req.body.n);
  res.json(ngrams);
}
