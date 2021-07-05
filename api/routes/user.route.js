// user.route.js 
//
// endpoint prefix = '/user'


const logger = require('../logger');
const generator = require('generate-password');

const mail = require('../mail');
if(mail.couldNotCreate){
  logger.info(
    "Could not create mail transporter which is required by the user route. Refusing to continue.");
  process.exit(1);
}

var crypto = require('crypto');


var express = require('express');
var userRoutes = express.Router();
var jwt = require('express-jwt');

let User = require('../models/user');

var auth = jwt({
  secret: 'sonJJxVqRC',
  userProperty: 'payload'
});

var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');

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

// Update username by id 
userRoutes.route('/updateUsername/:id').post((req, res) => {
  console.log(req.body.username);
    User.findById(req.params.id, (err, user) => {
        if(user) {
            user.username = req.body.username;
            user.save().then(() => {
                res.status(200).json("Username updated successfully");
             }).catch(err => {
                res.status(500).send(err);
            })
        } else {
            res.status(404).send(`User with _id ${req.params.id} could not be found`);
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
