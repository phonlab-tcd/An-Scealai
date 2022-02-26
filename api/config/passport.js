const logger = require('../logger');
const path  = require('path');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = require('../models/user');
mongoose.model('User');

const fs = require('fs');
const pub_key_path = path.join(__dirname, '..', 'pub_key.pem');
const PUB_KEY = fs.readFileSync(pub_key_path, 'utf8');


// ALL POSSIBLE JWT STRATEGY OPTIONS
//  const passportJWTOptions = {
//    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//    secretOrKey; PUB_KEY || secret_phrase,
//    issuer: 'issuer',
//    audience: 'audience',
//    algorithms: ['RS256']
//    ignoreExpiration: Boolean(x),
//    passReqToCallback: Boolean(x),
//    jsonWebTokenOptions: {
//      complete: false,
//      clockTolerance: '',
//      maxAge: '7d',
//      clockTimestamp: '100',
//      nonce: 'string here for OpenID'
//     },
//   }
const opts = {}
opts.jwtFromRequest =   ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey =      PUB_KEY;
opts.algorithms =       ['RS256']
// opts.jsonWebTokenOptions = {}
// opts.issuer =           'an-scéalaí-backend';
// opts.audience =         'an-scéalaí-frontend';
//

function jwtCallback(payload, done) {
  User.findById(payload.sub || payload._id, (err,user) => {
    if (err) return done(err, false);
    console.log('jwt success');
    return done(null, user ? user : false);
  });
}

function localCallback(username, password, done) {
  User.findOne({ username: username}, (err, user) => {
    if(err) { 
      logger.error(err);
      return done({error: err }); 
    }
  
    if(!user)
      return done({error: { messages: ['username_not_found', username]}, status: 404});
    if(!user.validPassword(password))
      return done({error: { messages: ['incorrect_password']}, status: 401});
    if(!user.status === 'Active')
      return done({error: { messages: ['activation_pending']}, email: user.email});
  
    // If everything is correct, return user object
    logger.info('Successfully authenticated (password) user:' + username);
    return done(null, user);
  });
}

module.exports = (passport) => {
  passport.use(new JwtStrategy(opts,jwtCallback));
  passport.use(new LocalStrategy(localCallback));
  passport.serializeUser((user,done)=>done(null,user._id));
  passport.deserializeUser(
    (id,done)=>User.findById(id,
      (err,user)=>done(err,user)));
}
