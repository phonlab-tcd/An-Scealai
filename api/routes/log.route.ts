const logger = require('../logger');
const makeEndpoints = require('../utils/makeEndpoints');
import { API500Error } from '../utils/APIError';
import getCurrentTimestamp from '../utils/getCurrentTimestamp';
import {appendTextToCSV} from '../utils/rotatingCsvLogger';

const LOG_DIRECTORY = 'logs/clientside_errors/';

async function clientsideErrorHandler(req, res) {

  console.log(req.url);
  const logThings = [getCurrentTimestamp(), req.body.route, req.body.message];
  try {
    await appendTextToCSV(logThings, LOG_DIRECTORY);
    res.status(200).json({
      success: true,
    })
  } catch(e) {
    throw new API500Error("Failed to write clientside error log");
  }
}

module.exports = makeEndpoints({
  post: {
    '/clientsideError': clientsideErrorHandler,
  },
});
