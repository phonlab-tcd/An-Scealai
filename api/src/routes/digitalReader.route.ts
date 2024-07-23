//import segmentBody from 'html-segmenter'
const segmentBody = require('html-segmenter')

const makeEndpoints = require('../utils/makeEndpoints');

const nodePandoc = require('node-pandoc-promise');

const express = require('express');
const multer = require('multer');
const path = require('path');

const fs = require('node:fs');

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp/uploads/')
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    cb(null, 'upload_' + Date.now() + ext)
  }
})

const upload = multer({
  storage: multerStorage
});

const digitalReaderRoute = express.Router();

//digitalReaderRoute.route('/docx2html').post(require('../endpoint/digitalReader/docx2html'))


//TODO : Factor some of this functionality out into services and individual endpoint files (?)


digitalReaderRoute.route('/docx2html').post(upload.single("docx"), async function (req, res) {

  console.log('Uploaded tmp docx file to file system')

  const pathToFile = req.file.path;

  const pandocArgs = ['-f', 'docx', '-t', 'html5', '--standalone', '--embed-resources', '--wrap=none', '--no-highlight'];

  const htmlOutput = await nodePandoc(pathToFile, pandocArgs);
  
  res.json(htmlOutput)

  fs.unlink(pathToFile, function (err) {
    if (err) {
      console.error('Problem removing docx file from file system')
      console.error(err)
    } else {
      console.log('Successfully removed tmp docx file from file system')
    }
  })
})

digitalReaderRoute.route('/segment-html').post(/*upload.single("docx"), */async function (req, res) {

  const html = req.body.text

  // gotten from sentence segmentation API
  const segmentedSentences = req.body.sentences //[{text: 'Test Document'}]
  
  // gotten from POS tagger API
  const segmentedWords = req.body.words //[{text: 'Test', pos:{}}, {text: 'Document',pos:{}}]

  const segmentedHtml = segmentBody(html, segmentedSentences, segmentedWords)
  
  res.json(segmentedHtml)
})

/*export = makeEndpoints({
    post: {
      //'/convert': require('../endpoint/digitalReader/dr-ify_html').default, //convert a html document to a digital-reader story
      '/docx2html': require('../endpoint/digitalReader/docx2html').default 
    },
  });*/

module.exports = digitalReaderRoute;