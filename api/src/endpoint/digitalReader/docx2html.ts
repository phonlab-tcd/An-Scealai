import {API400Error} from '../../utils/APIError';
//import { segment } from '../../utils/segment';
//const { spawn } = require('node:child_process');
import { spawn } from 'node:child_process'
const fs = require('node:fs');

export default (req, res) => {
  res.json({test: 'test!'})
}

// tokenise story text into sentences
export /*default*/ async function docx2html (req, res) {
  //if (!req.body.file) throw new API400Error('Must include file parameter in the request body.');

  /*const unzip = spawn('bash', ['./bin/unzip/unzipHtml.bash']);

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
  });*/

  /*const ls = spawn('ls', ['.']);

  let result = ''
  ls.stdout.on('data', (data) => {
    result += data
  })
  ls.stdout.on('close', () => {
    res.json(JSON.parse(result))
  })
  ls.on('error', (err) => {
    res.json(err)
  })*/

  /*const content = req.get('docx')
  try {
    fs.writeFileSync('TEST-FILE.docx', content);
    
    res.json({something : 'worked!'})
  } catch (err) {
    //console.error(err);
    res.json({err : err})
  }*/

  // for testing
  //throw new API400Error(req.get('docx'));
  //console.log(req)
  //console.log(req.get('docx'))
  //console.log(req.keys())
  console.log(typeof(req))
  console.log(Object.keys(req))
  console.log(req.body)
  console.log(typeof(req.body))
  console.log(Object.keys(req.body))
  console.log(req.docx)
  for (let key of Object.keys(req)) {
    console.log(`key: ${key},`)
    console.log(req[key])
  }
  //console.log(req.body)

  //res.json(req.get('docx'))
  console.log(Object.keys(res))
  res.json(req.formData())
  //res.formData(req.body)
}
