const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const pub_key_path = path.join(__dirname + '..' + 'priv_key.pem');
const PUB_KEY = fs.readFileSync(__dirname + '/../pub_key.pem', 'utf8');
const priv_key_path = path.join(__dirname + '..' + 'priv_key.pem');
const PRIV_KEY = fs.readFileSync(__dirname + '/../priv_key.pem', 'utf8');

verifyJwt = function(JWT) {
  return new Promise((resolve,reject)=>{
    jwt.verify(JWT, PUB_KEY, {algorithms: ['RS256'] }, (err, payload) => {
      if(err)reject(err);
      if(payload) {
        return resolve(payload);
      }
      return reject(false);
    });
  });
};

module.exports.verifyJwt = verifyJwt;

