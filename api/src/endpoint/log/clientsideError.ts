import { API500Error } from '../../utils/APIError';
import getCurrentTimestamp from '../../utils/getCurrentTimestamp';
import {appendTextToCSV} from '../../utils/rotatingCsvLogger';
import { Request, Response } from 'express';

const LOG_DIRECTORY = 'logs/clientside_errors/';

export default async function clientsideErrorHandler(req: Request, res: Response) {
    console.log(req.url);
    const logThings = [getCurrentTimestamp(), req.body?.route, req.body?.message];
    try {
      await appendTextToCSV(logThings, LOG_DIRECTORY);
      res.status(200).json({
        success: true,
      })
    } catch(e) {
      throw new API500Error("Failed to write clientside error log");
    }
}