const logger = require('../logger');
export default function(f) {
  try {
    return f();
  }
  catch(e) {
    logger.error(e);
  }
}
