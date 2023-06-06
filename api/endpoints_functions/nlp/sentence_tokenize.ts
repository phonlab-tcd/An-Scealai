import {API400Error} from '../../utils/APIError';
import { segment } from '../../utils/segment';

// tokenise story text into sentences
export default async function tokenizeHandler (req, res) {
  console.log(req.body);
  if (!req.body.text) throw new API400Error('Must include text parameter in the request body.');
  const tokens = segment(req.body.text);
  res.json(tokens);
}
