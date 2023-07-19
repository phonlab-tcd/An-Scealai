const logger = require('../logger');
const makeEndpoints = require('../utils/makeEndpoints');

import clientsideErrorHandler from "../endpoints_functions/log/clientsideError";


module.exports = makeEndpoints({
  post: {
    '/clientsideError': clientsideErrorHandler,
  },
});
