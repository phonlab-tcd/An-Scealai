const auth = require('../util/authMiddleware');
const gramadoirRouter = require('express').Router();
////////////////////////////////////////////// POST
gramadoirRouter
  .route('/insert')
  .post(require('../endpoint/gramadoir/insert'))
module.exports = gramadoirRouter;
