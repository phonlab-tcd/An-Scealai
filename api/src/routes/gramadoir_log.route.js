// @ts-nocheck
const auth = require('../utils/jwtAuthMw');
const gramadoirRoutes = require('express').Router();

const { getUniqueErrorTypeCounts } = require('../endpoint/gramadoir/getUniqueErrorTypeCounts');
const { getUserGrammarCounts } = require('../endpoint/gramadoir/getUserGrammarCounts');
const { getTimeGrammarCounts } = require('../endpoint/gramadoir/getTimeGrammarCounts');
const { callAnGramadoir } = require('../endpoint/gramadoir/callAnGramadoir');

// //////////////////////////////////////////// POST
const insertHandler = require('../endpoint/gramadoir/insert');
gramadoirRoutes
    .route('/insert')
    .post(auth, insertHandler);
const userGrammarCountsHandler = require('../endpoint/gramadoir/userGrammarCounts');
gramadoirRoutes
    .route('/userGrammarCounts')
    .post(auth, userGrammarCountsHandler);
gramadoirRoutes
    .route('/getTimeGrammarCounts/:ownerId')
    .post(auth, getTimeGrammarCounts);

// //////////////////////////////////////////// GET
gramadoirRoutes
    .route('/callAnGramadoir/:teacs')
    .get(auth, callAnGramadoir);
gramadoirRoutes
    .route('/getUniqueErrorTypeCounts/:storyId')
    .get(auth, getUniqueErrorTypeCounts);
gramadoirRoutes
    .route('/getUserGrammarCounts')
    .get(auth, getUserGrammarCounts);

module.exports = gramadoirRoutes;
