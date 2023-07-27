import { Request, Response } from "express";
import FeedbackComment from "../../models/feedbackComment";
const mongodb = require("mongodb");
const mongoose = require("mongoose");

export default async function deleteFeedbackCommentsForOwner( req: Request, res: Response ) {

  const comments = await FeedbackComment.find({ owner: req.params.ownerId });
  
  if (comments) {
    comments.forEach((comment) => {
      // delete any audio if added to comment
      if (comment.audioId) {
        let audioId;
        try {
          audioId = new mongoose.mongo.ObjectId(comment.audioId);
        } catch (err) {
          return res.status(400).json({
            message:
              "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters",
          });
        }

        const bucket = new mongodb.GridFSBucket(mongoose.connection.db, {
          bucketName: "feedbackCommentAudio",
        });

        bucket.delete(audioId, (err) => {
          if (err) {
            console.error("Error deleting comment audio");
            return res.status(404).json("Error deleting comment audio");
          }
        });
      }

      // delete comment
      comment.remove().then(
        () => res.json("Comment deleted"),
        (err) => res.status(400).json(err)
      );
    });
  }
}
