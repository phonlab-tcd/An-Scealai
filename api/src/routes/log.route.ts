const logger = require('../logger');
const makeEndpoints = require('../utils/makeEndpoints');

import clientsideErrorHandler from "../endpoint/log/clientsideError";


module.exports = makeEndpoints({
  post: {
    '/clientsideError': clientsideErrorHandler,
  },
});
