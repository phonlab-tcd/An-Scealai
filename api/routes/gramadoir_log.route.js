const auth = require('../utils/jwtAuthMw');
const gramadoirRoutes = require('express').Router();
////////////////////////////////////////////// POST
gramadoirRoutes
  .route('/insert')
  .post(auth, require('../endpoints_functions/gramadoir/insert'));

////////////////////////////////////////////// GET
gramadoirRoutes
  .route('/exampleSelect')
  .get(require('../endpoints_functions/gramadoir/exampleSelect'));

////////////////////////////////////////////// GET
gramadoirRoutes
  .route('/example/:type')
  .get(require('../endpoints_functions/gramadoir/example/:type'));

console.log(require('../endpoints_functions/gramadoir/example/:type'));

module.exports = gramadoirRoutes;
