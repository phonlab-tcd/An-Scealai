(()=>{
  const keypair       = require('./keypair');
  const jwt           = require('jsonwebtoken');
  const { algorithm } = require('../config/passport');
  const opts          = { algorithm };
  
  module.exports = async function verify_jwt(payload:object) {
    const key = await keypair.pub;
    return jwt.verify(payload, key, opts);
  }
})();
