const makeEndpoints = require('../utils/makeEndpoints');

const express = require('express');
var multer = require('multer');
var upload = multer();
//const app = express();
const digitalReaderRoute = express.Router();

//digitalReaderRoute.route('/docx2html').post(require('../endpoint/digitalReader/docx2html'))
digitalReaderRoute.route('/docx2html').post(upload.single("docx"), function (req, res) {
  console.log('test!')
  console.log(req)
  console.log(req.body)
  console.log(req.docx)
  for (let key of Object.keys(req)) {
    console.log(key)
  }
  console.log(req.file)
  res.json(req.file)
  //res.json(req.body)
})

/*export = makeEndpoints({
    post: {
      //'/convert': require('../endpoint/digitalReader/dr-ify_html').default, //convert a html document to a digital-reader story
      '/docx2html': require('../endpoint/digitalReader/docx2html').default 
    },
  });*/

module.exports = digitalReaderRoute;

//chatbotRoute.route('/sendRecordedAnswer').post(upload.single("file"), async function(req, res){