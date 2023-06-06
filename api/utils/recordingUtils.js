const mongoose = require('mongoose');
const mongodb = require('mongodb');
const { Readable } = require('stream');

async function upload(buffer, filename, metadata) {
  return await new Promise((resolve,reject)=>{
    const us = bucket().openUploadStream(filename, {metadata});
    us.on('error', () => reject(new Error(`file upload: ${filename}`)));
    us.on('finish', () => resolve(us.id));
    const readableTrackStream = new Readable();
    readableTrackStream.push(buffer);
    readableTrackStream.push(null);
    readableTrackStream.pipe(us);
  });
}

function bucket() {
  const db = mongoose.connection.db;
  const bucketName = 'voiceRecording';
  return new mongodb.GridFSBucket(db,{bucketName});
}

function filesCollection() {
  // @ts-ignore
  return bucket().s._filesCollection.collectionName;
}

async function file(_id) {
  const a = await bucket().find({ "_id": _id }).toArray();
  console.log('array', a);
  return a[0];
}
module.exports = {upload, bucket, filesCollection, file};