const makeEndpoints = require('../utils/makeEndpoints');

export = makeEndpoints({
    post: {
      '/convert': require('../endpoint/digitalReader/dr-ify_html').default, //convert a html document to a digital-reader story
      //'/unzip': require('../endpoint/digitalReader/unzip') //currently there is a bug with this code
    },
  });