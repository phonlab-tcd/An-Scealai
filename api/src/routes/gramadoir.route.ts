// @ts-nocheck
const gramadoirRoutes = require('express').Router();

const { getUniqueErrorTypeCounts } = require('../endpoint/gramadoir/getUniqueErrorTypeCounts');
const { getUserGrammarCounts } = require('../endpoint/gramadoir/getUserGrammarCounts');
const { getTimeGrammarCounts } = require('../endpoint/gramadoir/getTimeGrammarCounts');
const { callAnGramadoir } = require('../endpoint/gramadoir/callAnGramadoir');

// //////////////////////////////////////////// POST
import insertHandler from "../endpoint/gramadoir/insert";
import checkJwt from "../utils/jwtAuthMw";

gramadoirRoutes
    .route('/insert')
    .post(checkJwt, insertHandler);
const userGrammarCountsHandler = require('../endpoint/gramadoir/userGrammarCounts');
gramadoirRoutes
    .route('/userGrammarCounts')
    .post(checkJwt, userGrammarCountsHandler);
gramadoirRoutes
    .route('/getTimeGrammarCounts/:ownerId')
    .post(checkJwt, getTimeGrammarCounts);

// //////////////////////////////////////////// GET
gramadoirRoutes
    .route('/callAnGramadoir/:teacs')
    .get(checkJwt, callAnGramadoir);
gramadoirRoutes
    .route('/getUniqueErrorTypeCounts/:storyId')
    .get(checkJwt, getUniqueErrorTypeCounts);
gramadoirRoutes
    .route('/getUserGrammarCounts')
    .get(checkJwt, getUserGrammarCounts);

module.exports = gramadoirRoutes;
