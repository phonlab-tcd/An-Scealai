const logger = require('../../logger');
const pair = {
  pub:  undefined,
  priv: undefined,
}

const key_names = ['pub','priv'];
key_names.map(name=>{
  module.exports[name] = () => {
    return new Promise((resolve) => {
      const tryit = () => {
        console.log("TRY IT");
        if(pair[name]) return resolve(pair[name]);
        setTimeout(()=>{tryit()},1);
      };
      tryit();
    });
  }
});

function export_keys(pub,priv) {
  pair.pub  = pub;
  pair.priv = priv;
}

function write_file(path, data) {
  const fs = require('fs');
  return new Promise(function write_file_to_promise(resolve,reject) {
    fs.writeFile(path,data,(e)=>{
      if(e) return reject(e);
      return resolve();
    });
  });
}

function read_file(path) {
  const fs = require('fs');
  return new Promise(function write_file_to_promise(resolve,reject) {
    fs.readFile(path,(e,d) =>{
      if(e) return reject(e);
      return resolve(d);
    });
  });
}

async function write_keys_to_file(key_dir,pub,priv) {
  const [pub_path,priv_path] = get_paths(key_dir);
  return Promise.all([
    write_file(pub_path,pub),
    write_file(priv_path, priv),
  ]);
}

async function generate_keys() {
  logger.warning("GENERATING PUBLIC AND PRIVATE KEYS");
  const crypto = require('crypto');
  const opts = {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: process.env.PEM_KEY_PASSPHRASE,
    }
  };
  return new Promise(function key_to_promise(resolve,reject) {
    crypto.generateKeyPair('rsa', opts, function crypto_callback(e, pub, priv) {
      if(e) return reject(e);
      return resolve([pub,priv]);
    })
  });
}

function get_paths(key_dir) {
  const path = require('path');
  return [
    path.join(key_dir,'pub_key.pem'),
    path.join(key_dir,'priv_key.pem'),
  ];
}

async function read_keys(key_dir) {
  const [pub_path,priv_path] = get_paths(key_dir);
  return Promise.all([
    read_file(pub_path),
    read_file(priv_path)],
  );
}

(async function run() {
  const path     = require('path');
  const key_dir  = path.join(__dirname,'..','..','keys');
  let [pub,priv] = await read_keys(key_dir).catch(()=>[]);
  if(!pub || !priv) {
    [pub,priv] = await generate_keys();
    write_keys_to_file(key_dir,pub,priv);
  }
  export_keys(pub,priv);
  return;
})();
