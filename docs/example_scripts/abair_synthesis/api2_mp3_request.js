const request = require('request');

const text = "Dia is Muire is Jósef duit"; 

const baseurl = 'https://www.abair.tcd.ie';
const path = '/api2/synthesise';
const url = baseurl + path;

const formData = {
  input: text,
  voice: 'ga_CO_pmg_nnmnkwii',
  audioEncoding: 'MP3',
}

request( {url: url, qs: formData}, (err, response, body) => {
  if (err) { console.error(err); return; }
  console.log(`statusCode: ${response.statusCode}`);
  console.log(body);
});
