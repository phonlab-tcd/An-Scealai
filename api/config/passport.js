const logger = require('../logger');
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

      if(!user.status){
        logger.warning(`user: ${username} has not had their email validated`);
        User.findOneAndUpdate({username: username}, {status: 'Pending'}, (updateUserErr, updatedUser) => {
          if(updateUserErr){
            logger.error(updateUserErr)
          }
          if(updatedUser){
            logger.info({
              message:`user: ${username} has been updated to have status: 'Pending'`,
              updatedUser: updatedUser,
            });
          } else {
            logger.error(`Failed to give user: ${username} the status 'Pending'`);
          }
        });
      }

      if(user.status === 'Pending'){
        return done(null, false, {user: username, message: `User ${username} does not have a verified email. Email must be verified to log in.`}, user);
      }

      // If everything is correct, return user object
      return done(null, user);
    });
  }
));
