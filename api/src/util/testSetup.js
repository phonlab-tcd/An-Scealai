module.exports = async function setup() {
  require('dotenv').config();
 const config = require('./DB');
  
  // Setup for mongo to connect to 'process.env.TEST_MONGO_URL' for tests.
  process.env.TEST_MONGO_URL = (
    config.DB_URL_PREFIX +
    config.DB_AUTH_DETAILS +
    config.DB_HOSTNAME +
    config.TEST_DB_NAME );
  console.log('TEST_MONGO_URL',process.env.TEST_MONGO_URL);


  await require('./export_keypair');
}
