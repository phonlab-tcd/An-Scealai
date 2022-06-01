const logger = require('../util/logger');
const makeEndpoints = require('../util/makeEndpoints');

module.exports = makeEndpoints({
  get: {
    // endpoint = '/log/:level'
    '/:level/:message': (req, res) => {
      logger.log(req.params.level, req.params.message);
      res.status(200)
          .json({
            success: true,
            message: req.params.message,
            level: req.params.level});
    },
  },
});
