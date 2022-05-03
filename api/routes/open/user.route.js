// user.route.js 
// endpoint prefix = '/user'
const logger = require('../../logger');
const generator = require('generate-password');
const makeEndpoints = require('../../utils/makeEndpoints');
const passport = require('passport');

const mail = require('../../mail');
if(mail.couldNotCreate){
  logger.info(
    "Could not create mail transporter which is required by the user route. Refusing to continue.");
  process.exit(1);
}

const crypto = require('crypto');
const express = require('express');
let User = require('../../models/user');

const auth = require('../../utils/jwtAuthMw');

var ctrlProfile = require('../../controllers/profile');
var ctrlAuth = require('../../controllers/authentication');

let userRoutes;
// Immediately Invoked Function Expression.
// Scopes the imported functions to just this function
(() => {  
  // ENDPOINT HANDLERS
  const searchUser =
    require('../../endpoints_functions/user/searchUser');
  const getUserCount =
    require('../../endpoints_functions/user/getUserCount');

    userRoutes = makeEndpoints({
      get: {
        '/count': getUserCount,
      },
      post: {
        '/searchUser': searchUser,
      }
    });
})();

userRoutes.get('/viewUser', ctrlProfile.viewUser);
userRoutes.get('/teachers', ctrlProfile.getTeachers);

userRoutes.post('/register', ctrlAuth.register);
userRoutes.post('/login', passport.authenticate('local'), ctrlAuth.login);
userRoutes.get('/verify', ctrlAuth.verify);
userRoutes.post('/verifyOldAccount', ctrlAuth.verifyOldAccount);
userRoutes.post('/resetPassword', ctrlAuth.resetPassword);
userRoutes.get('/generateNewPassword', ctrlAuth.generateNewPassword);

function getLanguage(req, res) {
  return res.json(req.user.language);
}

userRoutes.get('/getLanguage/:id', getLanguage);

module.exports = userRoutes;
