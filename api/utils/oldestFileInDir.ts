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
    const oldestName = seekOldest(fileTimes);
    return path.join(dir,oldestName);
}

function seekOldest(arr: {name: string, time: number}[]): string {
    let oldest = arr[0];
    for (const next of arr) {
        if(next.time < oldest.time) {
            oldest = next;
        }
    }
    return oldest.name;
}