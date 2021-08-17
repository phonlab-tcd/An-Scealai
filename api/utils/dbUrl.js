const config = require('../DB');
const logger = require('../logger');
// use the URL for the test DB if it has been set, otherwise use the normal DB.
module.exports =
  process.env.TEST_MONGO_URL ||
  (
    config.DB_URL_PREFIX +
    config.DB_AUTH_DETAILS +
    config.DB_HOSTNAME +
    config.DB_NAME );


logger.info('dbUrl: ' + module.exports);
