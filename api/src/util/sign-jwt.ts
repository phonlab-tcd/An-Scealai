const keypair       = require('./keypair');
const jwt           = require('jsonwebtoken');
const { algorithm } = require('../config/passport');
const opts          = { algorithm }

module.exports = async function sign_jwt(payload:object) {
  const key = {
    key: await keypair.priv,
    passphrase: process.env.PEM_KEY_PASSPHRASE,
  };
  console.log(key);
  return jwt.sign(payload, key, opts);
}
