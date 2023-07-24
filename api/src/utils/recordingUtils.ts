import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import * as mongodb from "mongodb";
import { Readable } from "stream";


export function bucket() {
  const db = mongoose.connection.db;
  const bucketName = 'voiceRecording';
  return new mongodb.GridFSBucket(db,{bucketName});
}

export function filesCollection() {
  // @ts-ignore
  return bucket().s._filesCollection.collectionName;
}

export async function file(_id) {
  const a = await bucket().find({ "_id": _id }).toArray();
  return a[0];
}

// TODO: why double await here? (neimhin 21/July/23)
export async function upload(buffer, filename, metadata: any) {
  return await new Promise((resolve,reject)=>{
    const us = bucket().openUploadStream(filename, {metadata});
    us.on('error', () => reject(new Error(`file upload: ${filename}`)));
    us.on('finish', () => resolve(us.id as ObjectId));
    const readableTrackStream = new Readable();
    readableTrackStream.push(buffer);
    readableTrackStream.push(null);
    readableTrackStream.pipe(us);
  });
}