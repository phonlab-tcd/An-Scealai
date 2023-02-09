const auth = require('../utils/jwtAuthMw');
const gramadoirRoutes = require('express').Router();

const {getUniqueErrorTypeCounts} = require('../endpoints_functions/gramadoir/getUniqueErrorTypeCounts');
const {getUserGrammarCounts} = require('../endpoints_functions/gramadoir/getUserGrammarCounts');

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
gramadoirRoutes
    .route('/getUserGrammarCounts')
    .get(auth, getUserGrammarCounts);

module.exports = gramadoirRoutes;
