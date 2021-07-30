const config = require('../DB');

// Setup for mongo to connect to 'process.env.TEST_MONGO_URL' for tests.
process.env.TEST_MONGO_URL = (config.DB_URL_PREFIX + config.TEST_DB_NAME);