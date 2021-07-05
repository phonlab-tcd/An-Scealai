const logger = require('../logger');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = require('../models/user');
mongoose.model('User');

passport.use(new LocalStrategy(

  function(username, password, done) {
    User.findOne({ username: username}, function(err, user) {

      if(err) { 
        logger.error(err);
        return done(err); 
      }

      // If user doesn't exist
      if(!user) {
        return done(null, false, {
          message: 'username_not_found'
        });
      }

      // If password is wrong
      if(!user.validPassword(password)) {
        return done(null, false, {
          message: 'incorrect_password'
        });
      }

      // If everything is correct, return user object
      logger.info('Successfully authenticated user:' + username);
      return done(null, user);
    });
  }
));
