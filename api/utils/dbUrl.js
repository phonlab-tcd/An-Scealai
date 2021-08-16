const config = require('../DB');

module.exports =
  process.env.TEST_MONGO_URL ||
  ( config.DB_URL_PREFIX +
    config.DB_AUTH_DETAILS +
    config.DB_HOSTNAME +
    config.DB_NAME);
