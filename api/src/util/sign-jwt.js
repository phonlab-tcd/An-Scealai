const keypair = require('./keypair');
const jwt = require('jsonwebtoken');
const { algorithm } = require('../config/passport');
const opts = { algorithm }
const key = {
  key: keypair.PRIV,
  passphrase: process.env.PEM_KEY_PASSPHRASE,
};

module.exports = function sign_jwt(payload) {
  return jwt.sign(payload, key, opts);
}
