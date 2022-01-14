const request = require('request');
const url = require('url');
const abairBaseUrl = require('../abair_base_url');
const logger = require('../logger');

const permitted = {
  voice: {
  'ga_UL':              1,
  'ga_UL_anb_exthts':   2,
  'ga_UL_anb_nnmnkwii': 3,
  'ga_CO':              4,
  'ga_CO_hts':          5,
  'ga_CO_pmg_nnmnkwii': 6,
  'ga_MU_nnc_exthts':   7,
  'ga_MU_nnc_nnmnkwii': 8,
  'ga_MU_cmg_nnmnkwii': 9,
  },
  audioEncoding: {
    'LINEAR16':   1,
    'MP3':        2,
    'OGG_OPUS':   3,
  },
  outputType: {
    'JSON_WITH_TIMING': 1, // {timing: [], audioContent: string}
    'JSON':             2, // {audioContent: string}
    'HTML':             3, // rendered html page with audio element
  }
};

const defaultQuery = {
  voice: (() => {return 'ga_MU_nnc_nnmnkwii';}),
  audioEncoding: (() => {return 'MP3';}),
  outputType: (() => { return 'JSON_WITH_TIMING'; }),
};

const valid = {
  voice: ((str) => {
    return (str in permitted.voice)
      ? str
      : defaultQuery.voice(); }),
  audioEncoding: ((str) => {
    return (str in permitted.audioEncoding)
      ? str
      : defaultQuery.audioEncoding(); }),
  outputType: ((str) => {
      return (str in permitted.outputType)
        ? str
        : defaultQuery.outputType(); }),
}

/** @description - synthesise Irish text with
 *      https://www.abair.ie/api2/synthesise
 *
 *  @param query = {
 *    input,
 *    voice=defaultVoice(),
 *    outputType='JSON_WITH_TIMING',
 *    speed?,
 *    audioEncoding?,
 *  }
 *
 */
function synthesiseSingleSentenceDNN(query) {
  // query validation
  query.voice = valid.voice(query.voice);
  query.audioEncoding = valid.audioEncoding(query.audioEncoding);
  query.outputType = valid.outputType(query.outputType);
  return new Promise( (resolve, reject) => {
    request({
      url: abairBaseUrl + '/api2/synthesise',
      qs: query,
      method: 'GET', },
      (err, res, body) => {
        if (err) {
          logger.error({
            message: "synthesiseSingleSentenceDNN request err",
            error: err, });
          return reject({error: err, response: res, body: body}); }
        if (res.statusCode !== 200) {
          logger.error({
            message:"synthesiseSingleSentenceDNN non 200 status code",
            query: query }); }
        return resolve(body);
    });
  });
}

module.exports.synthesiseSingleSentenceDNN = synthesiseSingleSentenceDNN;
module.exports.permitted = permitted;
module.exports.defaultQuery = defaultQuery;
module.exports.valid = valid;
