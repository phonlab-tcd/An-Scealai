const express = require('express');
const synthesisRoutes = express.Router();
const logger = require('../logger');


// ENDPOINTS
synthesisRoutes.route('/api2/:text').get((res, req) =>{

  logger.info("Making request to synthesise: " + text);

  if(! req.params.text ){
    logger.error({
      endpoint: 'api2/:text',
      error: 'req.params.text is falsey',
    });
    res.status(400).json("text field is required");
    return;
  }

  abairAPIv2Synthesise(req.params.text, null)
    .then( body => { 
      logger.info("then got called");
      logger.info({ 
        endpoint: '/synthesis/api2/:text', 
        body: body });
      res.status(200).json(body);
    })
    .catch(err => {
      logger.error(
        {
          endpoint: '/synthesis/api2/:text', 
          text: req.params.text, 
          error: err,
        });
      res.status(500).json(body);
    });

  res.json("hello");
  res.send();
});

// FUNCTIONS
const request = require('request');

const abairAPIv2SynthUrl = 'https://www.abair.tcd.ie/api2/synthesise';
const abairAPIv2Voices = [
'ga_UL_anb_nnmnkwii', 
'ga_UL', 
'ga_UL_anb_exthts', 
'ga_CO', 
'ga_CO_hts', 
'ga_CO_pmg_nnmnkwii', 
'ga_MU_nnc_exthts', 
'ga_MU_nnc_nnmnkwii', 
'ga_MU_cmg_nnmnkwii'
];

/*
  'ga_UL_anb_nnmnkwii', 
  'ga_UL', 
  'ga_UL_anb_exthts', 
  'ga_CO', 
  'ga_CO_hts', 
  'ga_CO_pmg_nnmnkwii', 
  'ga_MU_nnc_exthts', 
  'ga_MU_nnc_nnmnkwii', 
  'ga_MU_cmg_nnmnkwii'
];
*/

function isValidAbairAPIv2DialectCode(code) {
  if(! typeof code === 'string'){
    return false;
  }
  for(let c in abairAPIv2Voices){
    if ( c === code ){
      return true;
    }
  }
}

async function abairAPIv2Synthesise(text, dialect){

  if(! isValidAbairAPIv2DialectCode(dialect) ) {
    logger.warning("Invalid dialect code given to abairAPIv2Synthesise:", dialect, ". Defaulting to: ", abairAPIv2Voices[0]);
    dialect = abairAPIv2Voices[0];
  }

  return new Promise( (resolve, reject) => {
    request({
      method: 'GET',
      headers: {
        'Host': 'www.abair.tcd.ie'
      },
      uri: `${abairAPIv2SynthUrl}?input=${text}&voice=${dialect}`,
    }, (err, response, body) => {
      if(err){
        logger.error(err);
        reject(err);
      }
      else {
        logger.info(body);
        resolve(JSON.parse(body));
      }
    });
  });
}


function synthesiseStory(story) {
  let dialectCode;
  if(story.dialect === 'connemara') dialectCode = 'ga_CM';
  if(story.dialect === 'donegal') dialectCode = 'ga_GD';
  if(story.dialect === 'kerry') dialectCode = 'ga_MU';

  // create a form with the story text, dialect choice, html, and speed
  let form = {
    Input: story.text,
    Locale: dialectCode,
    Format: 'html',
    Speed: '1',
  };

  // turn form into a url query string
  let formData = querystring.stringify(form);
  let contentLength = formData.length;

  return new Promise((resolve, reject) => {
    // make a request to abair passing in the form data
    request({
      headers: {
        'Host' : 'www.abair.tcd.ie',
        'Content-Length': contentLength,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      uri: 'https://www.abair.tcd.ie/webreader/synthesis',
      body: formData,
      method: 'POST'
    }, function (err, resp, body) {
      if(err) res.send(err);
      if(body) {
        // audioContainer is chunk of text made up of paragraphs
        let audioContainer = parse(body).querySelectorAll('.audio_paragraph');
        let paragraphs = [];
        let urls = [];
        // loop through every paragraph and fill array of sentences
        for(let p of audioContainer) {
          let sentences = [];
          for(let s of p.childNodes) {
            // push the sentences
            // s.rawTagName <--> s.tagName if synthesis text not appearing
            if(s.rawTagName === 'span') {
              sentences.push(s.toString());
            } 
            // push the audio ids for the sentences
            // s.rawTagName <--> s.tagName if synthesis text not appearing
            else if(s.rawTagName === 'audio') {
              urls.push(s.id);
            }
          }
          paragraphs.push(sentences);
        }
        resolve({html : paragraphs, audio : urls });
      } else {
        reject();
      }
    });
  });
}

module.exports = synthesisRoutes;
