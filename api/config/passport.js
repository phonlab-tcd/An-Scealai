const logger = require('../logger');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('../models/user');
mongoose.model('User');

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username}, (err, user) => {
      if(err) { 
        logger.error(err);
        return done({error: err }); 
      }

      if(!user) {
        return done({error: { messages: ['username_not_found', username]}, status: 404});
      }
      if(!user.validPassword(password)) {
        return done({error: { messages: ['incorrect_password']}, status: 401});
      }
      if(!user.status === 'Active') {
        return done({error: { messages: ['activation_pending']}, email: user.email, status: 400});
      }

      // If everything is correct, return user object
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
