const express = require('express');
const app = express();
const gramadoirRoutes = express.Router();

let GramadoirLog = require('../models/gramadoirLog');

// Create new stat entry in database
gramadoirRoutes.route('/insert').post((req, res) => {
  console.log('headers: ', req.headers);
  console.log('body :', req.body);
  res.send('hello');
});

module.exports = gramadoirRoutes;
