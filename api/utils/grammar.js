
const request = require('request');

/** @description - Get a promise which resolves to a
 *    list of tags describing grammar errors in the given text.
 * The grammar tags are written in the language passed in.
 *
 * @param {string} text - The Irish
 *    language text which will be checked for errors.
 *
 * @param {'ga' | 'en'} language - The iso
 *    language code to of the language to describe the errors in. 'ga' or 'en'.
 *
 * @return {Promise} - resolves to an array of grammar tags.
e*    rejects to a request error.
 */
function requestGrammarTags(text, language) {
  return new Promise( (resolve, reject) => {
    const form = {
      teacs: text.replace(/\n/g, ' '),
      teanga: language,
    };

    const formData = querystring.stringify(form);

    request({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      // uri: 'https://cadhan.com/api/gramadoir/1.0',
      uri: abairBaseUrl + '/cgi-bin/api-gramadoir-1.0.pl',
      body: formData,
      method: 'POST',
    }, (err, resp, grammarTags) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(grammarTags);
      }
    });
  });
}

module.exports.requestGrammarTags = requestGrammarTags;
