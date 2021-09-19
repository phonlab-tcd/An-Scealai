const config = require('../DB');
// use the URL for the test DB if it has been set, otherwise use the normal DB.
module.exports =
  process.env.TEST_MONGO_URL ||
  config.DB;
