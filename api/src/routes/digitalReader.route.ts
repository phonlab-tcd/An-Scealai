//import segmentBody from 'html-segmenter'
const segmentBody = require('html-segmenter')

const makeEndpoints = require('../utils/makeEndpoints');

const nodePandoc = require('node-pandoc-promise');

const express = require('express');
var multer = require('multer');
var path = require('path')

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp/uploads/')
  },
  filename: function (req, file, cb) {
    //const nameLessExt = file.fieldname + '_uploaded_'
    const ext = path.extname(file.originalname)
    cb(null, 'upload_' + Date.now() + ext)
  }
})

var upload = multer({
  storage: multerStorage
});

const digitalReaderRoute = express.Router();

//digitalReaderRoute.route('/docx2html').post(require('../endpoint/digitalReader/docx2html'))

//TODO : Refactor all this into a service (?), return the converted html file and return it to be used in a separate segmentation call.
digitalReaderRoute.route('/docx2html').post(upload.single("docx"), async function (req, res) {

  //console.log(req.file);

  const pathToFile = req.file.path;
  //console.log(pathToFile)

  //const pandocArgs = '-f docx -t html5 --standalone --embed-resources --wrap=none --no-highlight';
  const pandocArgs = ['-f', 'docx', '-t', 'html5', '--standalone', '--embed-resources', '--wrap=none', '--no-highlight'];

  const htmlOutput = await nodePandoc(pathToFile, pandocArgs);
  //console.log(htmlOutput)

  /*// call to sentence segmentation API
  const segmentedSentences = [] //[{text: 'Test Document'}]

  // call to POS tagger
  const segmentedWords = [] //[{text: 'Test', pos:{}}, {text: 'Document',pos:{}}]

  const segmentedHtml = segmentBody(htmlOutput, segmentedSentences, segmentedWords)
  console.log(segmentedHtml)*/
  
  //res.json(segmentedHtml)
  res.json(htmlOutput)

  //TODO : add removal of temporary file / remove storing of file altogether if possible
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