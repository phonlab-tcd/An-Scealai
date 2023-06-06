import { promises as fs } from 'fs';
import * as path from 'path';
import fileExists from "./fileExists";
import result from "./result";
import oldestFileInDir from './oldestFileInDir';
import getCurrentTimestamp from './getCurrentTimestamp';

const FILE_SIZE_LIMIT = 32 * 1024 * 1024; // 32 MB
const MAX_LOG_FILES = 32 * 5; //  32 * 32 * 5 = 5120 MB = ~ 5GB

async function appendToCSVFile(csvFilePath: string, text: string) {
    await fs.appendFile(csvFilePath, text);
}

async function fileSizeIsExceeded(filePath: string, limitInBytes: number): Promise<boolean> {
    const stats = await fs.stat(filePath);
    return stats.size >= limitInBytes;
}

async function deleteOldestFile(log_directory: string) {
    const oldestFile = await result(oldestFileInDir(log_directory));
    if("err" in oldestFile || !oldestFile.ok) {
        console.error(oldestFile);
        return;
    }
    const unlinkResult = await result(fs.unlink(oldestFile.ok));
    if("err" in unlinkResult) {
        console.error(unlinkResult);
    }
}

async function cleanupOldFiles(log_directory: string) {
    const filenamesResult = await result(fs.readdir(log_directory));
    if("err" in filenamesResult) {
        console.error(filenamesResult.err);
        return;
    }
    const filenames = filenamesResult.ok;
    if(filenames.length <= MAX_LOG_FILES) {
        return;
    }

    await deleteOldestFile(log_directory);
}

// This function renames the existing 'current.csv' to 'log_{timestamp}.csv', 
// and then makes a new empty current.csv.
// It will be called whenever current.csv hits the upper-bound on memory.
// By partitioning the logs like this we make it more convenient to load / analyse in python
async function moveOnToNextCSVFile(log_directory: string) {
    const timestamp = getCurrentTimestamp();
    const logFileName = `log_${timestamp}.csv`;
    const logFilePath = path.join(log_directory, logFileName);
    const currentFilePath = path.join(log_directory, 'current.csv');
    await fs.rename(currentFilePath, logFilePath);
    await fs.writeFile(currentFilePath, '');
    cleanupOldFiles(log_directory);
}

async function appendTextToCSV(text: string, log_directory: string): Promise<void> {
    let currentFilePath = path.join(log_directory, 'current.csv');
    if (!await fileExists(currentFilePath)) {
        await fs.mkdir(log_directory, {recursive: true});
        await fs.writeFile(currentFilePath, '');
    }

    if (await fileSizeIsExceeded(currentFilePath, FILE_SIZE_LIMIT)) {
        moveOnToNextCSVFile(log_directory);
    }

    await appendToCSVFile(currentFilePath, text);
}

export {appendTextToCSV};