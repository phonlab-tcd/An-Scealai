const makeEndpoints = require('../utils/makeEndpoints');
const gramadoirRoutes = makeEndpoints({
  post: {
    '/insert': require('../endpoints_functions/gramadoir/insert'),
  },
});
module.exports = gramadoirRoutes;
