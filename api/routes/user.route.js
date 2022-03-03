// user.route.js 
//
// endpoint prefix = '/user'


const logger = require('../logger');
const generator = require('generate-password');
const makeEndpoints = require('../utils/makeEndpoints');

const mail = require('../mail');
if(mail.couldNotCreate){
  logger.info(
    "Could not create mail transporter which is required by the user route. Refusing to continue.");
  process.exit(1);
}

var crypto = require('crypto');


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

    userRoutes = makeEndpoints({
      get: {
        '/count': getUserCount,
      },
      post: {
        '/searchUser': searchUser,
      }
    });
})();

userRoutes.get('/profile', auth, ctrlProfile.profileRead);
userRoutes.get('/viewUser', ctrlProfile.viewUser);
userRoutes.get('/teachers', ctrlProfile.getTeachers);

userRoutes.post('/register', ctrlAuth.register);
userRoutes.post('/login', ctrlAuth.login);
userRoutes.get('/verify', ctrlAuth.verify);
userRoutes.post('/verifyOldAccount', ctrlAuth.verifyOldAccount);
userRoutes.post('/resetPassword', ctrlAuth.resetPassword);
userRoutes.get('/generateNewPassword', ctrlAuth.generateNewPassword);

userRoutes.route('/setLanguage/:id').post((req, res) => {
    User.findById(req.params.id, (err, user) => {
        if(user) {
            user.language = req.body.language;
            user.save().then(() => {
                res.status(200).json("Language set successfully");
            }).catch(err => {
                console.log(err);
                res.status(400).send(err);
            })
        }
    });
});

userRoutes.route('/getLanguage/:id').get((req, res) => {
    User.findById(req.params.id, (err, user) => {
        if(err) {
          console.log(err);
          res.send(err);
        }
        if(user) {
            res.json({"language" : user.language});
        } else {
            res.status(404).json("User not found");
        }
    });
});

userRoutes.route('/getUserByUsername/:username').get((req, res) => {
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

// Endpoint to get all users from database
userRoutes.route('/getAllUsers').get((req, res) => {
    User.find({}, (err, users) => {
        if(err) {
          console.log(err);
          res.send(err);
        }
        if(users) {
            res.json(users);
        } else {
            res.status(404).json("No users exist on the database");
        }
    });
});

// Delete user by username
userRoutes.route('/deleteUser/:username').get(function(req, res) {
    User.findOneAndRemove({"username": req.params.username}, function(err, user) {
        if(err) {
          console.log(err);
          res.send(err);
        }
        else res.json("Successfully removed user");
    });
});


const validUsernameRegEx = /^[a-z0-9]+$/i;

// Update username by id
userRoutes.route('/updateUsername/:id').post((req, res) => {
  if ( !req.body.username ) {
    return res.status(400).send(
        'req.body.username is required');
  }
  if (!req.body.username.match(validUsernameRegEx) ) {
    return res.status(400).send(
        `${req.body.username} is an invalide username.` +
        `Valid characters are: a-z, A-Z, 0-9`);
  }
  console.log(req.body.username);
  // Validate Username
  User.findById(req.params.id, async (err, user) => {
    if (err) {
      logger.error(err);
      return res.status(500).send(err);
    }
    if (user) {
      user.username = req.body.username;
      try {
        await user.save(); // .then(() => {
        return res.status(200).json('Username updated successfully');
      } catch (err) {
        return res.status(500).send(err);
      }
    } else {
      return res
          .status(404)
          .send(`User with _id ${req.params.id} could not be found`);
    }
  });
});


// Update password by id 
userRoutes.route('/updatePassword/:id').post((req, res) => {
    User.findById(req.params.id, (err, user) => {
        if(user) {
            user.salt = crypto.randomBytes(16).toString('hex');
            user.hash = crypto.pbkdf2Sync(req.body.password, user.salt, 1000, 64, 'sha512').toString('hex');
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
    User.findOne({"username": req.body.username}, (err, user) => {
        if(err){
          return res.status(500).json(err);
        }
        if(user) {
            var randomPassword = generator.generate({
              length: 10,
              numbers: true
            });
            user.salt = crypto.randomBytes(16).toString('hex');
            user.hash = crypto.pbkdf2Sync(randomPassword, user.salt, 1000, 64, 'sha512').toString('hex');
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
