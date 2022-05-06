const base64url = require('base64url');
const crypto = require('crypto');
const signatureFunction  = crypto.createSign('RSA-SHA256');
const verifyFunction = crypto.createVerify('RSA-SHA256');
const fs = require('fs');

const headerObj = {
  alg: 'RS256',
  typ: 'JWT',
};

const payloadObj = {
  sub: '1234567890',
  name: 'John Doe',
  admin: true,
  iat: 1234567890
};

const headerObjString = JSON.stringify(headerObj);
const payloadObjString = JSON.stringify(payloadObj);

const encoded = {};
encoded.header = base64url(headerObjString);
encoded.payload = base64url(payloadObjString);

signatureFunction.write(encoded.header + '.' + encoded.payload);
signatureFunction.end();

const PRIV_KEY = fs.readFileSync(__dirname + '/../../priv_key.pem', 'utf8');
const PUB_KEY = fs.readFileSync(__dirname + '/../../pub_key.pem', 'utf8');
const signatureBase64 = signatureFunction.sign({
  key: PRIV_KEY,
  passphrase: 'top secret'
},'base64');
const signatureBase64Url = base64url.fromBase64(signatureBase64);
const jwtSignatureBase64 = base64url.toBase64(signatureBase64Url);


const signatureIsValid = verifyFunction.verify(PUB_KEY, signatureBase64, 'base64');

console.log(signatureIsValid);










// const jwt = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.NHVaYe26MbtOYhSKkoKYdFVomg4i8ZJd8_-RU8VNbftc4TSMb4bXP3l3YlNWACwyXPGffz5aXHc6lty1Y2t4SWRqGteragsVdZufDn5BlnJl9pdR_kdVFUsra2rWKEofkZeIC4yWytE58sMIihvo9H1ScmmVwBcQP6XETqYd0aSHp1gOa9RdUPDvoXQ5oqygTqVtxaDr6wUFKrKItgBMzWIdNZ6y7O9E0DhEPTbE9rfBo6KTFsHAZnMg4k68CDp2woYIaXbmYTWcvbzIuHO7_37GT79XdIwkm95QJ7hYC9RiwrV7mesbY4PAahERJawntho0my942XheVLmGwLMBkQ"
// 
// const jwtParts = jwt.split('.');
// 
// const encoded = {};
// const decoded = {};
// encoded.header = jwtParts[0];
// encoded.payload = jwtParts[1];
// encoded.signature = jwtParts[2];
// 
// decoded.header = base64url.decode(encoded.header);
// decoded.payload = base64url.decode(encoded.payload);
// decoded.signature = base64url.decode(encoded.signature);
// 
// console.dir(decoded);
