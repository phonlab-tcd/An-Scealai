// user.route.js 
// endpoint prefix = '/user'
const logger = require('../logger');
const generator = require('generate-password');
const makeEndpoints = require('../utils/makeEndpoints');
const passport = require('passport');
const checkJwt = require('../utils/jwtAuthMw');

const mail = require('../mail');

var crypto = require('node:crypto');

var express = require('express');

let User = require('../models/user');

const auth = require('../utils/jwtAuthMw');

var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');

let userRoutes;
// Immediately Invoked Function Expression.
// Scopes the imported functions to just this function
(() => {
  // ENDPOINT HANDLERS
  const searchUser =
    require('../endpoints_functions/user/searchUser');
  const getUserCount =
    require('../endpoints_functions/user/getUserCount');
  const updateUsername =
    require('../endpoints_functions/user/updateUsername');

  userRoutes = makeEndpoints({
    get: {
      '/count': getUserCount,
    },
    post: {
      '/searchUser': searchUser,
      '/updateUsername/:id': updateUsername,
    },
  });
})();


userRoutes.post('/register', ctrlAuth.register);
userRoutes.post('/login', passport.authenticate('local'), ctrlAuth.login);
userRoutes.post('/verifyOldAccount', ctrlAuth.verifyOldAccount);
userRoutes.post('/resetPassword', ctrlAuth.resetPassword);

userRoutes.get('/generateNewPassword', ctrlAuth.generateNewPassword);
userRoutes.get('/verify', ctrlAuth.verify);
userRoutes.get('/viewUser', checkJwt, ctrlProfile.viewUser);
userRoutes.get('/teachers', checkJwt, ctrlProfile.getTeachers);

userRoutes.route('/setLanguage/:id').post(checkJwt,(req, res) => {
    User.findById(req.params.id, (err, user) => {
        if(user) {
            user.language = req.body.language;
            user.save().then(() => {
                res.status(200).json("Language set successfully");
            }).catch(err => {
                logger.error(err.stack || err);
                res.status(400).send(err);
            })
        }
    });
});

userRoutes.route('/getLanguage/:id').get(checkJwt, (req, res) => {
    User.findById(req.user._id)
      .then(
        user => user ? res.json({language: user.language}) : res.status(404).json("User not found"),
        err  => { console.error(err); res.status(400).json(err); }
      );
});

userRoutes.route('/getUserByUsername/:username').get(checkJwt,(req, res) => {
    User.find({"username" : req.params.username}, (err, user) => {
        if(err) {
          console.log(err);
          res.send(err);
        }
        if(user) {
            res.json(user);
        } else {
            res.status(404).json("User not found");
        }
    });
});

// Delete user by username
userRoutes.route('/deleteUser/:username').get(function(req, res) {
    User.findOneAndRemove({"username": req.params.username}, null, function(err, user) {
        if(err) {
          console.log(err);
          res.send(err);
        }
        else res.json("Successfully removed user");
    });
});

// Update password by id 
userRoutes.route('/updatePassword/:id').post((req, res) => {
    User.findById(req.params.id, async function(err, user) {
        if(user) {
            user.salt = crypto.randomBytes(16).toString('hex');
            user.hash = (await crypto.pbkdf2(req.body.password, user.salt, 1000, 64, 'sha512')).toString('hex');
            user.save().then(() => {
                res.status(200).json("Password updated successfully");
             }).catch(err => {
                res.status(500).send(err);
            })
        } else {
            res.status(404).send(`User with _id ${req.params.id} could not be found`);
        }
    });
});


// Update account with random password, send user an email
userRoutes.route('/sendNewPassword/').post((req, res) => {
    User.findOne({"username": req.body.username}, async function (err, user) {
        if(err){
          return res.status(500).json(err);
        }
        if(user) {
            var randomPassword = generator.generate({
              length: 10,
              numbers: true
            });
            user.salt = crypto.randomBytes(16).toString('hex');
            user.hash = (await crypto.pbkdf2(randomPassword, user.salt, 1000, 64, 'sha512')).toString('hex');
            console.log("change password to: ", randomPassword);
            user.save().then(() => {

              //console.log("Constructing the mailObj");
              const mailObj = {
                from: "scealai.info@gmail.com",
                recipients: [req.body.email],
                subject: 'Update Password -- An Scéalaí',
                message: `Hello ${req.body.username},\nYour An Scéalaí password has been updated to:\n${randomPassword}`, // TODO ask the user to change their password again
              };

              mail.sendEmail(mailObj).then( (nodemailerRes) => {
                logger.info(nodemailerRes);
                res.status(200).json("Password updated successfully");
              }).catch( err => {
                logger.error(err);
                res.status(500);
              });
             }).catch(err => {
                res.status(500).json(err);
            })
        } else {
            res.status(404).json(`User with _id ${req.params.id} could not be found`);
        }
    });
});

module.exports = userRoutes;
