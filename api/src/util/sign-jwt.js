const keypair = require('./keypair');
const jwt = require('jsonwebtoken');
const { algorithm } = require('../../config/passport');
const opts = { algorithm }

function fatal_missing_key_passphrase() {
  logger.error("missing passphrase. please set PEM_KEY_PASPHRASE env var");
  process.exit(1);
}

const key = {
  key: keypair.PRIV,
  passphrase: process.env.PEM_KEY_PASSPHRASE,
};

module.exports = function sign_jwt(payload) {
  return jwt.sign(payload, key, opts);
}
