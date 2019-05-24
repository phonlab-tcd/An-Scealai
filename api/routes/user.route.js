var express = require('express');
var userRoutes = express.Router();
var jwt = require('express-jwt');

var auth = jwt({
    secret: 'sonJJxVqRC',
    userProperty: 'payload'
});

var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');

userRoutes.get('/profile', auth, ctrlProfile.profileRead);

userRoutes.post('/register', ctrlAuth.register);
userRoutes.post('/login', ctrlAuth.login);

module.exports = userRoutes;