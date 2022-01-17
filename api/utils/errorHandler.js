const {
  API400Error,
  API404Error,
  APIError,
  API500Error} = require('./APIError');
const logger = require('../logger');

/**
 * An express middleware for handling the different
 * APIErrors that we have defined. Any error that is
 * thrown and caught in our endpoint functions will be passed
 * through this errorHandler, where we can add standard
 * handling rules for each type of error.
 */
function errorHandler(err, req, res, next) {
  console.dir(err);

  logger.alert({errorHandler: {err}});

  if (!(err instanceof APIError)) {
      return res.send(err);
  }
  if (err instanceof API400Error ) {
    return res.status(400).json(err.message);
  }
  if (err instanceof API404Error ) {
    return res.status(404).json(err.message);
  }
  if (err instanceof API500Error) {
      // Notify us
  }
  // Handle other status codes in whatever ways we want
  return res.status(err.status).json(err.message);
}

module.exports = errorHandler;
