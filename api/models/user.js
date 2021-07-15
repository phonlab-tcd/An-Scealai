var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

const generate_password = require('generate-password');

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
        default: 'STUDENT'
    },
    language: {
        type: String,
        enum: ['ga', 'en'],
        default: 'en'
    },
    hash: String,
    salt: String,
    status: {
      type: String,
      enum: ['Pending','Active'],
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
    }
});

userSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function(password) {
    return this.hash === crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validStatus = function() {
  if (!this.status) {
    return false;
  }
  const allowableStatus = /^(Active|Pending)$/;
  return this.status.match(allowableStatus);
}

userSchema.methods.generateJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        username: this.username,
        role: this.role,
        language: this.language,
        exp: parseInt(expiry.getTime() / 1000 /* convert milliseconds to seconds */),
    }, "sonJJxVqRC"); // 5ecret
};

userSchema.methods.generateNewPassword = function () {
  return generate_password.generate({
    length: 10,
    numbers: true
  });
}

userSchema.methods.generateResetPasswordLink = function (baseurl) {
  if ( ! this.resetPassword ) {
    this.resetPassword = {};
  }

  this.resetPassword.code = jwt.sign({username: this.username, email: this.email}, 'sonJJxVqRC');
  this.resetPassword.date = new Date();
  return `${baseurl}user/generateNewPassword?username=${this.username}&email=${this.email}&code=${this.resetPassword.code}`;
}

userSchema.methods.generateActivationLink = function (baseurl, language) {
  // Make sure this.verification exists
  if ( ! this.verification ) {
    this.verification = {};
  }
  this.verification.code = jwt.sign({username: this.username, email: this.email},'sonJJxVqRC');
  this.verification.date = new Date();
  return `${baseurl}user/verify?username=${this.username}&email=${this.email}&language=${language}&verificationCode=${this.verification.code}`;
}

module.exports = mongoose.model('User', userSchema);
