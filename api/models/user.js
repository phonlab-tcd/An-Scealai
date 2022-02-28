const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const generate_password = require('generate-password');
const fs = require('fs');
const { oneWeekFromNowMs } = require.main.require('./utils/time');
const Event =  require.main.require('./models/event');
const logger =  require.main.require('./logger');

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

const userSchema = new mongoose.Schema({
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

userSchema.methods.loginEvent = (userId) => {
  const event = new Event({
    type: "LOGIN",
    userId: userId,
    date: new Date(),
  });
  console.log(event);
  event.save();
};

userSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(
      password,
      this.salt,
      1000,
      64,
      'sha512').toString('hex');
};

userSchema.methods.validPassword = function(password) {
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

const PRIV_KEY = fs.readFileSync(__dirname + '/../priv_key.pem','utf8');
const PUB_KEY = fs.readFileSync(__dirname + '/../pub_key.pem','utf8');

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
userSchema.methods.generateResetPasswordLink = function(baseurl) {
  if ( ! this.resetPassword )
    this.resetPassword = {};
  this.resetPassword.code = this.generateJwt();
  this.resetPassword.date = new Date();
  return `${baseurl}user/generateNewPassword?jwt=${this.resetPassword.code}`;
};

// NOTE This function does not save the details.
// They must be saved with <document>.save();
userSchema.methods.generateActivationLink = function(baseurl, language) {
  // Make sure this.verification exists
  if ( ! this.verification )
    this.verification = {};
  this.verification.code = this.generateJwt(); 
  this.verification.date = new Date();
  return `${baseurl}user/verify?jwt=${this.verification.code}`;
}

module.exports = mongoose.model('User', userSchema);
