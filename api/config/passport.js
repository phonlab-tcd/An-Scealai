const logger = require('../logger');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('../models/user');
mongoose.model('User');

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username}, (err, user) => {
      if(err) return done(err); 
      if(!user) return done(null, false);
      if(!user.validPassword(password)) return done(null, false);
      logger.info('Successfully authenticated user: ' + username);
      return done(null, user);
    });
  }
));

passport.serializeUser((user,done)=>{
  done(null,user._id);
});
passport.deserializeUser((id,done)=>{
  User.findById(id, (err,user)=>{
    done(err,user);
  });
});
