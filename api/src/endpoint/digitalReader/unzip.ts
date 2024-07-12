import {API400Error} from '../../utils/APIError';
//import { segment } from '../../utils/segment';
//const { spawn } = require('node:child_process');
import { spawn } from 'node:child_process'

// tokenise story text into sentences
export default async function unzipHtml (req, res) {
  if (!req.body.file) throw new API400Error('Must include file parameter in the request body.');

  const unzip = spawn('bash', ['./bin/unzip/unzipHtml.bash']);

  let result = ''
  unzip.stdout.on('data', (data) => {
      result += data
  });
  unzip.on('close', () => {
    //add try catch
    res.json(JSON.parse(result))
  });
  unzip.on('error', (err) => {
    res.json(err)
  });
}
