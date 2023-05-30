import {Request, Response, NextFunction} from 'express';

import * as fs from 'fs';
import * as path from 'path';

const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB
const LOG_DIRECTORY = 'monitoring/api_logger/logs';

function getCurrentTimestamp(): string {
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}_${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;
  return timestamp;
}

function appendToCSVFile(csvFilePath: string, text: string): void {
    fs.appendFile(csvFilePath, text, (err) => {
        if (err) {
            console.error('Error appending to CSV file:', err);
        }
    });
}

function fileSizeIsExceeded(filePath: string, limitInBytes: number): boolean {
    const stats = fs.statSync(filePath);
    return stats.size >= limitInBytes;
}

// This function renames the existing 'current.csv' to 'log_{timestamp}.csv', 
// and then makes a new empty current.csv.
// It will be called whenever current.csv hits the upper-bound on memory.
// By partitioning the logs like this we make it more tractable to load / analyse in python
function moveOnToNextCSVFile() {
    const timestamp = getCurrentTimestamp();
    const logFileName = `log_${timestamp}.csv`;
    const logFilePath = path.join(LOG_DIRECTORY, logFileName);
    const currentFilePath = path.join(LOG_DIRECTORY, 'current.csv');
    fs.rename(currentFilePath, logFilePath, () => {
        fs.writeFileSync(currentFilePath, '');
    });
}

function appendTextToCSV(text: string): void {
    let currentFilePath = path.join(LOG_DIRECTORY, 'current.csv');
    if (!fs.existsSync(currentFilePath)) fs.writeFileSync(currentFilePath, '');

    if (fileSizeIsExceeded(currentFilePath, FILE_SIZE_LIMIT)) {
        moveOnToNextCSVFile();
    }

    appendToCSVFile(currentFilePath, text);
}


export default function logAPICall(req, res: Response, next: NextFunction): void {
    const start = Date.now();

    res.on('finish', () => {
        // This skips 'preflight requests' [1] as their information isn't as useful / representative of user experience.
        // [1] https://docs.sensedia.com/en/faqs/Latest/apis/preflight.html#:~:text=How%20it%20works-,Preflight%20request,actual%20HTTP%20request%20is%20sent.
        if (req.method == 'OPTIONS') return;
        const end = Date.now()
        const latency = end - start; // in milliseconds
        const endpointUrl = `${res.req.baseUrl}${req.route ? req.route.path : ''}`;
        const statusCode = res.statusCode;
        const reqBody = JSON.stringify(req.body);
        const reqBodyCsv = `"${reqBody.replace(/"/g, '""')}"`;
        const clientIp = req.clientIp;
        const log = getCurrentTimestamp() + ',' + clientIp + ',' + endpointUrl + ',' + statusCode + ',' + reqBodyCsv + ',' + latency + '\n';
        appendTextToCSV(log);
    });
    next();
}