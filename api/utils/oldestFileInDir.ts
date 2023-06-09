import { PathLike, promises as fs } from "fs";
import * as path from "path";
import result from "./result";

export default async function oldestFileInDir(dir): Promise<PathLike | false> {
    const filesResult = await result(fs.readdir(dir));
    if("err" in filesResult) {
        console.error(filesResult);
        return false;
    }
    const filenames = filesResult.ok;
    const fileTimes = await Promise.all(filenames.map(async function (fileName) {
        return {
            name: fileName,
            time: await fs.stat(path.join(dir,fileName)).then(stats=>stats.mtime.getTime()),
        };
    }));
    if(!fileTimes[0]) {
        return false;
    }
    const oldestName = fileTimes.reduce((a, b) => a.time < b.time ? a : b, fileTimes[0]).name
    return path.join(dir,oldestName);
}