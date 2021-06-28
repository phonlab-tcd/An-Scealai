var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = require('../models/user');
mongoose.model('User');

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username}, function (err, user) {
      if(err) { 
        console.log(err);
        return done(err); 
      }
      // If user doesn't exist
      if(!user) {
        return done(null, false, {
          message: 'Username not found'
        });
      }
      // If password is wrong
      if(!user.validPassword(password)) {
        return done(null, false, {
          message: 'Incorrect password'
        });
      }
      // If everything is correct, return user object
      return done(null, user);
    });
  }
));
