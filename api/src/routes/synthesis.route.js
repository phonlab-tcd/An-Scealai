const express = require('express');
const synthesisRoutes = express.Router();
const logger = require('../logger');

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
  'ga_MU_cmg_nnmnkwii',
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

/**
 * Check if valid dialect code
 * @param {any} code Dialect code
 * @return {boolean} return if valid dialect code
 */
function isValidAbairAPIv2DialectCode(code) {
  return abairAPIv2Voices.includes(code);
}

/**
 * Call Abair synthesis on story text
 * @param {string} text Story text
 * @param {string} dialect dialect choice
 * @return {Promise<any>} Synthesis response
 */
async function abairAPIv2Synthesise(text, dialect) {
  if (! isValidAbairAPIv2DialectCode(dialect) ) {
    logger.warning('Invalid dialect code given to abairAPIv2Synthesise:', dialect, '. Defaulting to: ', abairAPIv2Voices[0]);
    dialect = abairAPIv2Voices[0];
  }

  return new Promise( (resolve, reject) => {
    request({
      method: 'GET',
      headers: {
        'Host': 'www.abair.tcd.ie',
      },
      uri: `${abairAPIv2SynthUrl}?input=${text}&voice=${dialect}`,
    }, (err, response, body) => {
      if (err) {
        logger.error(err);
        reject(err);
      } else {
        logger.info(body);
        resolve(JSON.parse(body));
      }
    });
  });
}

module.exports = synthesisRoutes;
