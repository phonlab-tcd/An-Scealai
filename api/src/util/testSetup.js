module.exports = async function setup() {
  const config = require('./DB');
  
  // Setup for mongo to connect to 'process.env.TEST_MONGO_URL' for tests.
  process.env.TEST_MONGO_URL = (
    config.DB_URL_PREFIX +
    config.DB_AUTH_DETAILS +
    config.DB_HOSTNAME +
    config.TEST_DB_NAME );
  console.log('TEST_MONGO_URL',process.env.TEST_MONGO_URL);


  const keypair = require('./keypair');
  const pub = await keypair.pub;
  const priv = await keypair.priv;
  process.env.PUB_KEY = pub;
  process.env.PRIV_KEY = priv;
  console.log('pub',pub);
  console.log('priv',priv);
}
