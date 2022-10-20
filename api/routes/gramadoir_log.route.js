const auth = require('../utils/jwtAuthMw');
const gramadoirRoutes = require('express').Router();

const { getUniqueErrorTypeCounts } = require('../endpoints_functions/gramadoir/getUniqueErrorTypeCounts')

////////////////////////////////////////////// POST
gramadoirRoutes
  .route('/insert')
  .post(auth, require('../endpoints_functions/gramadoir/insert'));
////////////////////////////////////////////// GET
gramadoirRoutes
  .route('/getUniqueErrorTypeCounts/:storyId')
  .get(auth, getUniqueErrorTypeCounts);

module.exports = gramadoirRoutes;
