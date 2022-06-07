import { randomBytes } from 'crypto';
export = function randomString(length: number = 32) {
  return randomBytes(length).toString('hex');
}
