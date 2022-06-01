const auth = require('../util/authMiddleware');
const gramadoirRoutes = require('express').Router();
////////////////////////////////////////////// POST
gramadoirRoutes
  .route('/insert')
  .post(auth.jwtmw, require('../endpoints_functions/gramadoir/insert'))
module.exports = gramadoirRoutes;
