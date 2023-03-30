require('../keys/dev/load');
const config = require('../DB');
jest.setTimeout(500);

// Setup for mongo to connect to 'process.env.TEST_MONGO_URL' for tests.
process.env.TEST_MONGO_URL = (
  config.DB_URL_PREFIX +
  config.DB_AUTH_DETAILS +
  config.DB_HOSTNAME +
  config.TEST_DB_NAME );
