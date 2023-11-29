import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import * as mongodb from "mongodb";
import { Readable } from "stream";

export function bucket(collectionName: string) {
  const db = mongoose.connection.db;
  const bucketName = collectionName;
  return new mongodb.GridFSBucket(db,{bucketName});
}

export function filesCollection(collectionName: string) {
  // @ts-ignore
  return bucket(collectionName).s._filesCollection.collectionName;
}

export async function file(_id, collectionName) {
  const a = await bucket(collectionName).find({ "_id": _id }).toArray();
  return a[0];
}

export async function countDocuments(conditions: Object, collectionName: string) {
  const docs = await bucket(collectionName).find(conditions).toArray();
  return docs.length;
}

// TODO: why double await here? (neimhin 21/July/23)
export async function upload(buffer, filename, metadata: any, collectionName: string) {
  return await new Promise((resolve,reject)=>{
    const us = bucket(collectionName).openUploadStream(filename, {metadata});
    us.on('error', () => reject(new Error(`file upload: ${filename}`)));
    us.on('finish', () => resolve(us.id as ObjectId));
    const readableTrackStream = new Readable();
    readableTrackStream.push(buffer);
    readableTrackStream.push(null);
    readableTrackStream.pipe(us);
  });
}