import {API400Error} from '../../utils/APIError';
//import { segment } from '../../utils/segment';
//const { spawn } = require('node:child_process');
import { spawn } from 'node:child_process'

// tokenise story text into sentences
export default async function convertHtmlToDigitalReaderDoc (req, res) {
  if (!req.body.text) throw new API400Error('Must include text parameter in the request body.');
  //const tokens = segment(req.body.text);
  // We want to split any tokens containing newline symbols into separate tokens.
  // @ts-ignore -- for some reason it thinks acc has never[] type... but it should be string[]
  //const tokensWithoutNewlines = tokens.reduce((acc, curr) => acc.concat(curr.split("\n")), []);
  //res.json(tokensWithoutNewlines);

  // test.py not yet added to GitHub
  /*const py = spawn('python', ['./bin/python/test.py']);

  let result = ''
  py.stdout.on('data', (data) => {
      result += data
  });
  py.on('close', () => {
    //add try catch
    res.json(JSON.parse(result))
  });
  py.on('error', (err) => {
    res.json(err)
  });*/
}
