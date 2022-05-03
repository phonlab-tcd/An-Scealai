const open = new require('express').Router();

open.use('/user', require('./open/user.route'));

module.exports = open;
