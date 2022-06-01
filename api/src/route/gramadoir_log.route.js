const auth = require('../util/authMiddleware');
const gramadoirRoutes = require('express').Router();
////////////////////////////////////////////// POST
gramadoirRoutes
  .route('/insert')
  .post(auth.jwtmw, require('../endpoint/gramadoir/insert'))
module.exports = gramadoirRoutes;
