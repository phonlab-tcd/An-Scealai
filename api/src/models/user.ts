import mongoose from 'mongoose';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import generate_password from 'generate-password';
import fs from 'fs';
import { oneWeekFromNowMs } from '../utils/time';
import Event from './event';
import caught from 'src/utils/caught';
const logger = require('../logger');

type BaseUrl = 'http://localhost:4000' | 'https://www.abair.ie/anscealaibackend';

interface VerificationI {
  code: string;
  date: Date;
}

interface ResetPasswordI {
  code: string;
  date: Date;
}

interface UserDocument {
  username: string;
  email?: string;
  role: 'ADMIN'|'TEACHER'|'STUDENT';
  language: 'ga'|'en';
  hash: string,
  salt: string,
  status: 'Pending'|'Active';
  verification: VerificationI;
  resetPassword: ResetPasswordI;
  generateJwt: ()=>string;
}

const verificationSchema = new mongoose.Schema({
  code: {
    type: String,
  },
  date: {
    type: Date,
  }
});

const resetPasswordSchema = new mongoose.Schema({
  code: {
    type: String,
  },
  date: {
    type: Date,
  }
});

const userSchema = new mongoose.Schema<UserDocument>({
  username: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  email: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ['ADMIN', 'TEACHER', 'STUDENT'],
    default: 'STUDENT',
  },
  language: {
    type: String,
    enum: ['ga', 'en'],
    default: 'en',
  },
  hash: String,
  salt: String,
  status: {
    type: String,
    enum: ['Pending', 'Active'],
    default: 'Pending',
  },
  verification: {
    type: verificationSchema,
    unique: true,
    default: {
      code: null,
      date: null,
    },
  },
  resetPassword: {
    type: resetPasswordSchema,
    unique: true,
    default: {
      code: null,
      date: null,
    },
  },
});

userSchema.methods.loginEvent = (userId: mongoose.ObjectId) => {
  const event = new Event({
    type: "LOGIN",
    userId: userId,
    date: new Date(),
  });
  console.log(event);
  event.save();
};

userSchema.methods.setPassword = function(password: string) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(
      password,
      this.salt,
      1000,
      64,
      'sha512').toString('hex');
};

userSchema.methods.validPassword = function(password: string) {
  return this.hash === crypto
      .pbkdf2Sync(
          password,
          this.salt,
          1000,
          64,
          'sha512').toString('hex');
};

userSchema.methods.validStatus = function() {
  if (!this.status) {
    return false;
  }
  const allowableStatus = /^(Active|Pending)$/;
  return this.status.match(allowableStatus);
};

const PRIV_KEY = fs.readFileSync(__dirname + '/../../priv_key.pem','utf8');
// const PUB_KEY = fs.readFileSync(__dirname + '/../../pub_key.pem','utf8');

userSchema.methods.generateJwt = function() {
  return jwt.sign({
    _id: this._id,
    username: this.username,
    role: this.role,
    language: this.language,
    exp: oneWeekFromNowMs(),
    iat: Date.now()/1000,
  },{
    key: PRIV_KEY, passphrase: 'top secret'
  },{
    algorithm: 'RS256'
  });
};


userSchema.methods.generateNewPassword = function() {
  return generate_password.generate({
    length: 10,
    numbers: true,
  });
};

// NOTE This function does not save the details.
// They must be saved with <document>.save();
userSchema.methods.generateResetPasswordLink = function(baseurl: BaseUrl) {
  if ( ! this.resetPassword )
    this.resetPassword = {
      code: this.generateJwt(),
      date: new Date(),
    };
  return `${baseurl}user/generateNewPassword?jwt=${this.resetPassword.code}`;
};

// NOTE This function does not save the details.
// They must be saved with <document>.save();
userSchema.methods.generateActivationLink = function(baseurl: BaseUrl) {
  logger.info(this.verification);
  if (!this.verification.code)
    this.verification = {
      code: this.generateJwt(),
      date: new Date(),
    };

  try {
    return ''.concat(
      `${baseurl}user/verify?`,
      `language=${this.language}&`,
      `username=${this.username}&`,
      `email=${this.email}&`,
      `jwt=${this.verification.code}`,
    );
  } catch (e) {
    logger.error(e)
  }
}

export default mongoose.model('User', userSchema);
