module.exports.algorithm = 'RS256';

const logger        = require('../logger');
const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy   = require('passport-jwt').Strategy;
const ExtractJwt    = require('passport-jwt').ExtractJwt;
const mongoose      = require('mongoose');
const User          = require('../models/user');
const path          = require('path');
const fs            = require('fs');
const pub_key_path  = path.join(__dirname, '..', '..', 'pub_key.pem');
const PUB_KEY       = fs.readFileSync(pub_key_path, 'utf8');


function verify(username, password, cb) {
  console.log(username);
  User.findOne({username: username}, (err, user) => {
    if(err)
      return cb(err); 

    if(!user)
      return cb({ messageKeys: ['username_not_found'], status: 404},false);

    if(!user.validPassword(password))
      return cb({ messageKeys: ['incorrect_password'], status: 401},false);

    if(user.status !== 'Active')
      return cb({messageKeys: ['email_not_verified'], email: user.email, status: 401},false);

    // If everything is correct, return user object
    logger.info('Successfully authenticated user: ' + username);
    return cb(null, user);
  });
}
passport.use(new LocalStrategy(verify));

function jwtCallback(payload, done) {
  User.findById(payload._id, (err,user) => {
    if (err) return done(err, false);
    return done(null, user ? user : false);
  });
}

const opts = {
  jwtFromRequest:   ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey:      PUB_KEY,
  algorithms:       [module.exports.algorithm],
}
passport.use(new JwtStrategy(opts,jwtCallback));

passport.serializeUser((user,done)=>done(null,user._id));
passport.deserializeUser((id,done)=>{
  User.findById(id,(err,user)=>done(err,user));
});
