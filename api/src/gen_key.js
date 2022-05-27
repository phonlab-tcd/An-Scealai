const fs = require('fs');
const w = (err) => {if(err)console.dir(err)}
const { generateKeyPair } = require('crypto');
generateKeyPair('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'top secret',
  }
}, (e, publicKey, privateKey) => {
  w(e); 
  fs.writeFile('pub_key.pem',publicKey,'utf8',(er)=>{w(er)});
  fs.writeFile('priv_key.pem',privateKey,'utf8',(er)=>{w(er)});
});
