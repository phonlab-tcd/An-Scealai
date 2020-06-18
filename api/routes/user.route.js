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

userRoutes.route('/setLanguage/:id').post((req, res) => {
    User.findById(req.params.id, (err, user) => {
        if(user) {
            user.language = req.body.language;
            user.save().then(() => {
                res.status(200).json("Language set successfully");
            }).catch(err => {
                resizeBy.status(400).send(err);
            })
        }
    });
});

userRoutes.route('/getLanguage/:id').get((req, res) => {
    User.findById(req.params.id, (err, user) => {
        if(user) {
            res.json({"language" : user.language});
        } else {
            res.status(404).json("User not found");
        }
    });
});

userRoutes.route('/getUserByUsername/:username').get((req, res) => {
    User.find({"username" : req.params.username}, (err, user) => {
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
        if(users) {
            res.json(users);
        } else {
            res.status(404).json("No users exist on the database");
        }
    });
});

module.exports = userRoutes;