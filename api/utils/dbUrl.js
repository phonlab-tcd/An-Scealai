(()=>{
  const config = require('../DB');
  // use the URL for the test DB if it has been set, otherwise use the normal DB.
  if(process.env.NODE_ENV === 'test') return module.exports = global.__MONGO_URI__;

  module.exports =
    (process.env.DB_URL_PREFIX   || config.DB_URL_PREFIX   ) +
    (process.env.DB_AUTH_DETAILS || config.DB_AUTH_DETAILS ) +
    (process.env.DB_HOSTNAME     || config.DB_HOSTNAME     ) +
    (process.env.DB              || config.DB              );
})();
