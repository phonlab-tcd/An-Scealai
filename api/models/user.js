var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

const verificationSchema = new mongoose.Schema({
  code: String,
  date: Date,
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
      required: true,
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
    }
});

userSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};

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

userSchema.methods.generateActivationLink = function (baseurl) {
  // Make sure this.verification exists
  if ( ! this.verification ) {
    this.verification = {};
  }
  this.verification.code = jwt.sign({username: this.username, email: this.email},'sonJJxVqRC');
  this.verification.date = new Date();
  return `${baseurl}user/verify?username=${this.username}&email=${this.email}&verificationCode=${this.verification.code}`;
}

module.exports = mongoose.model('User', userSchema);
