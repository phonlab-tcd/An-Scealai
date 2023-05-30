import {Request, Response, NextFunction} from 'express';

import { promises as fs } from 'fs';
import * as path from 'path';
import fileExists from "../../utils/fileExists";
import result from "../../utils/result";
import oldestFileInDir from '../../utils/oldestFileInDir';

const FILE_SIZE_LIMIT = 32 * 1024 * 1024; // 32 MB
const MAX_LOG_FILES = 32 * 5; //  32 * 32 * 5 = 5120 MB = ~ 5GB
const LOG_DIRECTORY = process.env.LOG_DIRECTORY || 'monitoring/api_logger/logs';

function getCurrentTimestamp(): string {
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}_${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;
  return timestamp;
}

async function appendToCSVFile(csvFilePath: string, text: string) {
    await fs.appendFile(csvFilePath, text);
}

async function fileSizeIsExceeded(filePath: string, limitInBytes: number): Promise<boolean> {
    const stats = await fs.stat(filePath);
    return stats.size >= limitInBytes;
}

async function deleteOldestFile() {
    const oldestFile = await result(oldestFileInDir(LOG_DIRECTORY));
    if("err" in oldestFile || !oldestFile.ok) {
        console.error(oldestFile);
        return;
    }
    const unlinkResult = await result(fs.unlink(oldestFile.ok));
    if("err" in unlinkResult) {
        console.error(unlinkResult);
    }
}

async function cleanupOldFiles() {
    const filenamesResult = await result(fs.readdir(LOG_DIRECTORY));
    if("err" in filenamesResult) {
        console.error(filenamesResult.err);
        return;
    }
    const filenames = filenamesResult.ok;
    if(filenames.length < MAX_LOG_FILES) {
        return;
    }

    await deleteOldestFile();
}

// This function renames the existing 'current.csv' to 'log_{timestamp}.csv', 
// and then makes a new empty current.csv.
// It will be called whenever current.csv hits the upper-bound on memory.
// By partitioning the logs like this we make it more convenient to load / analyse in python
async function moveOnToNextCSVFile() {
    const timestamp = getCurrentTimestamp();
    const logFileName = `log_${timestamp}.csv`;
    const logFilePath = path.join(LOG_DIRECTORY, logFileName);
    const currentFilePath = path.join(LOG_DIRECTORY, 'current.csv');
    await fs.rename(currentFilePath, logFilePath);
    await fs.writeFile(currentFilePath, '');
}

async function appendTextToCSV(text: string): Promise<void> {
    let currentFilePath = path.join(LOG_DIRECTORY, 'current.csv');
    if (!await fileExists(currentFilePath)) {
        await fs.mkdir(LOG_DIRECTORY, {recursive: true});
        await fs.writeFile(currentFilePath, '');
    }

    if (await fileSizeIsExceeded(currentFilePath, FILE_SIZE_LIMIT)) {
        moveOnToNextCSVFile();
    }

    await appendToCSVFile(currentFilePath, text);
}


export default function logAPICall(req: Request, res: Response, next: NextFunction): void {
    console.log("INCOMING", req.originalUrl);
    const start = Date.now();

    res.on('finish', async () => {
        // This skips 'preflight requests' [1] as their information isn't as useful / representative of user experience.
        // [1] https://docs.sensedia.com/en/faqs/Latest/apis/preflight.html#:~:text=How%20it%20works-,Preflight%20request,actual%20HTTP%20request%20is%20sent.
        if (req.method == 'OPTIONS') return;
        const end = Date.now()
        const latency = end - start; // in milliseconds
        const statusCode = res.statusCode;
        const reqBody = JSON.stringify(req.body) || "";
        const reqBodyCsv = `"${reqBody.replace(/"/g, '""')}"`;
        const clientIp = (req as any).clientIp;
        const log = [getCurrentTimestamp(), clientIp, req.originalUrl, statusCode, reqBodyCsv, latency, "\n"].join(",");
        await appendTextToCSV(log);
    });
    next();
}
