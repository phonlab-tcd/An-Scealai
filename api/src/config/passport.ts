import passport from "passport";
import { Strategy } from "passport-local";
import User from "../models/user";

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
    console.log('Successfully authenticated user: ' + username);
    return cb(null, user);
  });
}

// call the verify function to find user in the DB that matches the credentials
// @ts-ignore
passport.use( new Strategy( verify));

// save user id to session so it can be used in deseriaizeUser()
passport.serializeUser((user, done)=>{
  // @ts-ignore
  done(null, user._id);
});

// get user object from the DB using the provided id
passport.deserializeUser((id, done)=>{
  User.findById(id, (err, user)=>{
    done(err, user);
  });
});
