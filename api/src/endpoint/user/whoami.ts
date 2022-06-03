import { Response } from 'express';
import { Request  } from 'express';
const logger = require('../../util/logger');

(()=>{
  const User = require('../../model/user');
  
  module.exports = function whoami(
    req: Request & {user: typeof User},
    res: Response,
  ) {
    logger.info('/user/whoamai');
    return res.json(req.user);
  }
})();
