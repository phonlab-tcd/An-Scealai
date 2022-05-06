import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

export const pub_key_path = path.join(__dirname, '..', '..', 'pub_key.pem');
export const PUB_KEY = fs.readFileSync(pub_key_path, 'utf8');
export const priv_key_path = path.join(__dirname,'..','..','priv_key.pem');
export const PRIV_KEY = fs.readFileSync(priv_key_path, 'utf8');

export function verifyJwt(JWT: string) {
  return new Promise((resolve,reject)=>{
    jwt.verify(JWT, PUB_KEY, {algorithms: ['RS256'] }, (err: any, payload: any) => {
      if(err)reject(err);
      if(payload) {
        return resolve(payload);
      }
      return reject(false);
    });
  });
};
