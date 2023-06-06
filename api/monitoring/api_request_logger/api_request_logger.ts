import {Request, Response, NextFunction} from 'express';
import getCurrentTimestamp from '../../utils/getCurrentTimestamp';
import {appendTextToCSV} from '../../utils/rotatingCsvLogger';

/**
 
    This script logs some details about all API requests that pass through our Node / Express server.
    It logs them to a CSV file which we've set up some python notebooks to quickly analyse.

**/

const LOG_DIRECTORY = process.env.LOG_DIRECTORY || 'monitoring/api_request_logger/logs';

export default function logAPICall(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();

    res.on('finish', async () => {
        // This skips 'preflight requests' [1] as their information isn't as useful / representative of user experience.
        // [1] https://docs.sensedia.com/en/faqs/Latest/apis/preflight.html#:~:text=How%20it%20works-,Preflight%20request,actual%20HTTP%20request%20is%20sent.
        if (req.method == 'OPTIONS') return;
        const end = Date.now()
        const latency = end - start; // in milliseconds
        const statusCode = res.statusCode;
        const reqBody = req.body ? JSON.stringify(req.body) : "";
        const reqBodyCsv = `"${reqBody.replace(/"/g, '""')}"`;
        const endpointUrl = `${res.req.baseUrl}${req.route ? req.route.path : ''}`;
        const clientIp = (req as any).clientIp;
        const log = [getCurrentTimestamp(), clientIp, endpointUrl, req.originalUrl, statusCode, reqBodyCsv, latency, "\n"].join(",");
        await appendTextToCSV(log, LOG_DIRECTORY);
    });
    next();
}
