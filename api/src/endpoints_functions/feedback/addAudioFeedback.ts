import { Request, Response } from "express";
import FeedbackComment from "../../models/feedbackComment";
const multer = require("multer");
const { Readable } = require("stream");
const mongodb = require("mongodb");
const mongoose = require("mongoose");

/**
 * Check that the request object contains an audio file
 * @param req Audio request
 * @returns
 */
function getMulterHandle(req): Express.Multer.File {
  return req.file;
}

export default async function addAudioFeedback(req: Request, res: Response) {
  FeedbackComment.findById(req.params.id, (err, comment) => {
    if (err) {
      console.error(err);
      return res.json(err);
    }
    if (comment) {
      // get bucket (collection) for storing audio file
      const bucket = new mongodb.GridFSBucket(mongoose.connection.db, {
        bucketName: "feedbackCommentAudio",
      });

      // delete any pre-existing audio
      if (comment.audioId) {
        bucket.delete(new mongoose.mongo.ObjectId(comment.audioId), (err) => {
          if (err) {
            console.error("Error deleting comment audio");
            return res.status(404).json("Error deleting comment audio");
          }
        });
      }

      const storage = multer.memoryStorage();
      const upload = multer({
        storage: storage,
        limits: { fields: 1, fileSize: 6000000, files: 1, parts: 2 },
      });

      upload.single("audio")(req, res, (err) => {
        if (err) {
          console.error(err);
          return res.status(400).json({ message: "Upload Request Validation Failed" });
        }

        // check that audio file exists
        const audioFile = getMulterHandle(req);
        if (!audioFile) {
          console.error(new Error("Multer file does not exist"));
          return res.status(500).json("request does not contain audio file");
        }

        // create new stream and push audio data
        const readableTrackStream = new Readable();
        readableTrackStream.push(audioFile.buffer);
        readableTrackStream.push(null);
        // get bucket (collection) for storing audio file
        const bucket = new mongodb.GridFSBucket(mongoose.connection.db, {
          bucketName: "feedbackCommentAudio",
        });

        // get audio file from collection and save id to comment audio id
        const uploadStream = bucket.openUploadStream(
          "audio-for-comment-" + comment._id.toString()
        );
        comment.audioId = uploadStream.id;
        comment.save();
        // pipe data in stream to the audio file entry in the db
        readableTrackStream.pipe(uploadStream);

        uploadStream.on("error", () => {
          return res.status(500).json({ message: "Error uploading file" });
        });

        uploadStream.on("finish", () => {
          return res.status(201).json({
            message: "File uploaded successfully, stored under Mongo",
          });
        });
      });
    } else {
      res.status(404).json({ message: "Comment does not exist" });
    }
  });
}
