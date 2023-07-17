import crypto from "node:crypto";
import { promisify } from "node:util";
const pbkdf2 = promisify(crypto.pbkdf2);
export default pbkdf2;