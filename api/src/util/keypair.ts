const logger = require('./logger');
export type Keypair = {pub: Promise<string>, priv: Promise<string>};
const pair: {pub: string|undefined; priv: string|undefined} = {
  pub:  undefined,
  priv: undefined,
};

type Keys = {
  pub: string;
  priv: string;
}

const pub = promised_prop('pub');
const priv = promised_prop('priv');
module.exports = { pub, priv };

function promised_prop(name: 'pub'|'priv'): Promise<string> {
  return new Promise(function promised_prop_callback(resolve) {
    function try_prop() {
      console.log('TRY PROP');
      const val = pair[name];
      if (val === undefined) setTimeout(try_prop,1);
      else if(typeof val === "string") resolve(val);
    };
    try_prop();
  });
}

function export_keys(keys: Keys) {
  pair.pub  = keys.pub;
  pair.priv = keys.priv;
}

function write_file(path:string, data:string) {
  const fs = require('fs');
  return new Promise<void>(function write_file_to_promise(resolve,reject) {
    fs.writeFile(path,data,(e:any)=>{
      if(e) return reject(e);
      return resolve();
    });
  });
}

function read_file(path:string): Promise<string> {
  const fs = require('fs');
  return new Promise(function write_file_to_promise(resolve,reject) {
    fs.readFile(path,'utf8',(e:any,d:string) =>{
      if(e) return reject(e);
      return resolve(d);
    });
  });
}

async function write_keys_to_file(key_dir:string,keys: Keys) {
  const [pub_path,priv_path] = get_paths(key_dir);
  return Promise.all([
    write_file(pub_path,  keys.pub),
    write_file(priv_path, keys.priv),
  ]);
}

async function generate_keys(): Promise<Keys> {
  logger.warning("GENERATING PUBLIC AND PRIVATE KEYS");
  if(!process.env.PEM_KEY_PASSPHRASE) {
    logger.error("FATAL ERROR: PEM_KEY_PASSPHRASE IS FALSEY");
    process.exit(1);
  }
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
    crypto.generateKeyPair('rsa', opts, function crypto_callback(e:any, pub:string, priv:string) {
      if(e) return reject(e);
      return resolve({pub,priv});
    })
  });
}

function get_paths(key_dir:string) {
  const path = require('path');
  return [
    path.join(key_dir,'pub_key.pem'),
    path.join(key_dir,'priv_key.pem'),
  ];
}

async function read_keys(key_dir:string): Promise<Keys> {
  const [pub_path,priv_path] = get_paths(key_dir);
  const keys = await Promise.all([
    read_file(pub_path),
    read_file(priv_path)]);
  return {
    pub:  keys[0],
    priv: keys[1]
  }
}

(async function run() {
  const path     = require('path');
  const key_dir  = path.join(__dirname,'..','..','keys');
  let keys: Keys|'fail' = await read_keys(key_dir).catch(()=>'fail');
  if(keys === 'fail') {
    keys = await generate_keys();
    write_keys_to_file(key_dir,keys);
  }
  export_keys(keys);
  return;
})();
