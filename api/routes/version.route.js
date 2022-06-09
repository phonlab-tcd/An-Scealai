const {describe,it} = require('../utils/inline-tests')();
const versionRoutes = require('express').Router();
const path = require('path');

versionRoutes.get('/',(req, res) => {
  return res.sendFile(path.join(__dirname, '../package.json'));
});

module.exports = versionRoutes;
