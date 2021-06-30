const logger = require('../logger');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = require('../models/user');
mongoose.model('User');

passport.use(new LocalStrategy(
  async (username, password, done) => {
    User.findOne({ username: username}, async (err, user) => {
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

      // TODO do this in one fell swoop for the entire database and delete this code
      if(!user.status){
        logger.warning(`user: ${username} has not had their email validated`);
        await User.findOneAndUpdate(
          // Find
          {username: username},
          // Update
          {status: 'Pending'},
          // Callback
          (updateUserErr, updatedUser) => {
          if(updateUserErr){
            logger.error(updateUserErr)
          }
          if(updatedUser){
            logger.info({
              message:`user: ${username} has been updated to have status: 'Pending'`,
              updatedUser: updatedUser,
            });
            // Return the updated user to the login function in ./api/controllers/authentication
            user = updatedUser;
          } else {
            logger.error(`Failed to give user: ${username} the status 'Pending'`);
          }
        });
      }

      /*
      if(user.status === 'Pending'){
        console.log(user);
        return done(
          null, 
          false,
          {
            userStatus: 'Pending',
            user: username, 
            message: `User ${username} does not have a verified email. Email must be verified to log in.`});
      }
      */

      // If everything is correct, return user object
      return done(null, user);
    });
  }
));
