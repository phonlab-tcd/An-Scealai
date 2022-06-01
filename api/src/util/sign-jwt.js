const keypair       = require('./keypair');
const jwt           = require('jsonwebtoken');
const { algorithm } = require('../config/passport');
const opts          = { algorithm }

module.exports = async function sign_jwt(payload) {
  const key = {
    key: await keypair.priv(),
    passphrase: process.env.PEM_KEY_PASSPHRASE,
  };
  return jwt.sign(payload, key, opts);
}
