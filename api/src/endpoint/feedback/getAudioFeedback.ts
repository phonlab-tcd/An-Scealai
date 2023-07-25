import { Request, Response } from "express";
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const FeedbackComment = require("../../models/feedbackComment");

export default async function addAudioFeedback(req: Request, res: Response) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      invalidObjectId: req.params.id,
    });
  }
  let audioId;
  // get the audio id from the audio id set to the comment
  try {
    audioId = new mongodb.ObjectID(req.params.id);
  } catch (err) {
    return res.status(400).json({
      message:
        "Invalid trackID in URL parameter. " +
        "Must be a single String of 12 bytes " +
        "or a string of 24 hex characters",
    });
  }

  res.set("content-type", "audio/mp3");
  res.set("accept-ranges", "bytes");
  // get collection name for audio files
  const bucket = new mongodb.GridFSBucket(mongoose.connection.db, {
    bucketName: "feedbackCommentAudio",
  });
  // create a new stream of file data using the bucket name
  const downloadStream = bucket.openDownloadStream(audioId);
  // write stream data to response if data is found
  downloadStream.on("data", (chunk) => {
    res.write(chunk);
  });

  downloadStream.on("error", () => {
    res.sendStatus(404);
  });
  // close the stream after data sent to response
  downloadStream.on("end", () => {
    res.end();
  });
}
