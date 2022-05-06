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
import User from '../../models/user';

// const auth = require('../../utils/jwtAuthMw');

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

function findUser(req, res, next) {
  console.log(req.body);
  User.findOne({username: req.body.username})
    .then((u)=>{
      if(!u)
        return res.status(404).json({messageKeys: ['username_not_found']});
      req.user = u;
      next()
    });
}

function authenticateUser(req, res, next) {
  console.log(req.user);
  if(!req.user.validPassword(req.body.password))
    return res.sendStatus(401);
  next()
}

function checkUserStatus(req, res, next) {
  console.log(req.user.validStatus());
  if(req.user.status !== 'Active'){
    return res.status(400).json({email: req.user.email, userPending: true, messageKeys: ['email_not_verified']});
  }
  next()
}

userRoutes.post('/login',
  findUser,
  authenticateUser,
  checkUserStatus,
  ctrlAuth.login);
userRoutes.get('/verify', ctrlAuth.verify);
userRoutes.post('/verifyOldAccount', ctrlAuth.verifyOldAccount);
userRoutes.post('/resetPassword', ctrlAuth.resetPassword);
userRoutes.get('/generateNewPassword', ctrlAuth.generateNewPassword);


module.exports = userRoutes;
