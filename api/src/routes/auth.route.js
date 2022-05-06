const express = require('express');
const auth = express.Router();
const user = require('./auth/user.route');
auth.use('/user', user);
module.exports = auth;
