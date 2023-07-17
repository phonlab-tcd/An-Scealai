const logger = require('../logger');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('../models/user');
mongoose.model('User');

/**
 * Authenticate a user with their username and password
 * @param {string} username
 * @param {string} password
 * @param {any} cb callback
 */
function verify(username, password, cb) {
  console.log('Logging in: ' + username);
  User.findOne({username: username}, (err, user) => {
    if (err) {
      return cb(err);
    }

    if (!user) {
      return cb({messageKeys: ['username_not_found'], status: 404}, false);
    }

    if (!user.validPassword(password)) {
      return cb({messageKeys: ['incorrect_password'], status: 401}, false);
    }

    if (user.status !== 'Active') {
      return cb({messageKeys: ['email_not_verified'], email: user.email, status: 401}, false);
    }

    // If everything is correct, return user object
    logger.info('Successfully authenticated user: ' + username);
    return cb(null, user);
  });
}

// call the verify function to find user in the DB that matches the credentials
passport.use(new LocalStrategy(verify));

// save user id to session so it can be used in deseriaizeUser()
passport.serializeUser((user, done)=>{
  done(null, user._id);
});

// get user object from the DB using the provided id
passport.deserializeUser((id, done)=>{
  User.findById(id, (err, user)=>{
    done(err, user);
  });
});
