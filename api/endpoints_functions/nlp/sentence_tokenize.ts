import {API400Error} from '../../utils/APIError';

const winkNLP = require('wink-nlp');
const model = require('wink-eng-lite-web-model');
const nlp = winkNLP(model);

module.exports = async (req, res) => {
  if (!req.body.text) throw new API400Error('Must include text parameter in the request body.');
  const tokens = nlp.readDoc(req.body.text).sentences().out();
  res.json(tokens);
  
}
