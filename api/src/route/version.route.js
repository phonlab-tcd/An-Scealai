const versionRoutes = require('express').Router();
const path = require('path');
const package_obj = require('../../package.json');

versionRoutes.get('/',(req, res) => {
  return res.json(package_obj.version);
});

module.exports = versionRoutes;
