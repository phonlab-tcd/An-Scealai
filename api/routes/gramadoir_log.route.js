const auth = require('../utils/jwtAuthMw');
const gramadoirRoutes = require('express').Router();
////////////////////////////////////////////// POST
gramadoirRoutes
  .route('/insert')
  .post(auth, require('../endpoints_functions/gramadoir/insert'))
////////////////////////////////////////////// GET
module.exports = gramadoirRoutes;
