const logger = require('../logger');
const makeEndpoints = require('../utils/makeEndpoints');
import { API500Error } from '../utils/APIError';
import getCurrentTimestamp from '../utils/getCurrentTimestamp';
import {appendTextToCSV} from '../utils/rotatingCsvLogger';

const LOG_DIRECTORY = 'monitoring/clientside_error_logs';

module.exports = makeEndpoints({
  post: {
    '/clientsideError': async (req, res) => {
      const logText = [getCurrentTimestamp(), req.body.route, JSON.stringify(req.body.message)].join(',');
      try {
        await appendTextToCSV(logText, LOG_DIRECTORY);
        res.status(200).json({
          success: true,
          logText: logText
        })
      } catch(e) {
        throw new API500Error("Failed to write clientside error log");
      }
    }
  },
});
