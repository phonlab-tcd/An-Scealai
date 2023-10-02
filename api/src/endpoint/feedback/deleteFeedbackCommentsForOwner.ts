import { Request, Response } from "express";
import FeedbackComment from "../../models/feedbackComment";
const mongodb = require("mongodb");
const mongoose = require("mongoose");

export default async function deleteFeedbackCommentsForOwner(
  req: Request,
  res: Response
) {
  const comments = await FeedbackComment.find({ owner: req.params.ownerId });

  if (comments) {
    deleteComments(comments)
      .then((response) => {
        return res.status(200).json(response);
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json(err);
      });
  }
}

async function deleteComments(comments) {
  try {
    for (const comment of comments) {
      // delete any audio if added to comment
      if (comment.audioId) {
        let audioId;
        try {
          audioId = new mongoose.mongo.ObjectId(comment.audioId);
        } catch (err) {
          return {
            status:
              "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters",
          };
        }

        const bucket = new mongodb.GridFSBucket(mongoose.connection.db, {
          bucketName: "feedbackCommentAudio",
        });

        bucket.delete(audioId, (err) => {
          if (err) {
            console.error("Error deleting comment audio");
            return { status: "Error deleting comment audio" };
          }
        });
      }
      await comment.remove();
    }

    return { status: "Comments deleted successfully" };
  } catch (err: any) {
    return { status: "Error deleting comments", error: err.message };
  }
}
