const logger = require('../logger');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('../models/user');
mongoose.model('User');

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

passport.serializeUser((user,done)=>{
  done(null,user._id);
});
passport.deserializeUser((id,done)=>{
  User.findById(id, (err,user)=>{
    done(err,user);
  });
});
