import result from "./result";
import {promises as fs} from "fs";
export default async function fileExists(filepath) {
    const stat = await result(fs.stat(filepath));
    if("err" in stat) return false; // if cannot stat then assume file does not exist
    return stat.ok.isFile(); // e.g. filepath="/" will return false
}