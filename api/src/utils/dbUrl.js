const config = require('../DB');

function hostname(x) {
  if(x[x.length  - 1] === "/") return x;
  return x + "/";
}

function auth(x) {
  if(!x) return "";
  if(x[x.length  - 1] === "@") return x;
  return x + "@";
}

function pick(key) {
  const val = process.env[key];
  if(val) return val;
  return config[key];
}

function db_url() {
  return pick("DB_URL_PREFIX") +
  auth(pick("DB_AUTH_DETAILS") ) +
  hostname( pick("DB_HOSTNAME") ) +
  pick("DB");
}

// use the URL for the test DB if it has been set, otherwise use the normal DB.
module.exports = process.env.TEST_MONGO_URL || db_url();

