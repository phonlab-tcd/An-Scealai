const auth = require('../utils/jwtAuthMw');
const gramadoirRoutes = require('express').Router();

const {getUniqueErrorTypeCounts} = require('../endpoints_functions/gramadoir/getUniqueErrorTypeCounts');
const {getUserGrammarCounts} = require('../endpoints_functions/gramadoir/getUserGrammarCounts');
const { getTimeGrammarCounts } = require('../endpoints_functions/gramadoir/getTimeGrammarCounts');

// //////////////////////////////////////////// POST
gramadoirRoutes
    .route('/insert')
    .post(auth, require('../endpoints_functions/gramadoir/insert'));
gramadoirRoutes
    .route('/userGrammarCounts')
    .post(auth, require('../endpoints_functions/gramadoir/userGrammarCounts'));
gramadoirRoutes
    .route('/getTimeGrammarCounts/:ownerId')
    .post(auth, getTimeGrammarCounts);
// //////////////////////////////////////////// GET
gramadoirRoutes
    .route('/getUniqueErrorTypeCounts/:storyId')
    .get(auth, getUniqueErrorTypeCounts);
gramadoirRoutes
    .route('/getUserGrammarCounts')
    .get(auth, getUserGrammarCounts);

module.exports = gramadoirRoutes;
