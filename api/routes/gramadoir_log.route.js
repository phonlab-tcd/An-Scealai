const auth = require('../utils/jwtAuthMw');
const gramadoirRoutes = require('express').Router();

const {getUniqueErrorTypeCounts} = require('../endpoints_functions/gramadoir/getUniqueErrorTypeCounts');

// //////////////////////////////////////////// POST
gramadoirRoutes
    .route('/insert')
    .post(auth, require('../endpoints_functions/gramadoir/insert'));
gramadoirRoutes
    .route('/userGrammarCounts')
    .post(auth, require('../endpoints_functions/gramadoir/userGrammarCounts'));
// //////////////////////////////////////////// GET
gramadoirRoutes
    .route('/getUniqueErrorTypeCounts/:storyId')
    .get(auth, getUniqueErrorTypeCounts);

module.exports = gramadoirRoutes;
