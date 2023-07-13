import { Request, Response } from "express";
import FeedbackComment from "../../models/feedbackComment";

export default async function updateFeedbackComment( req: Request, res: Response ) {
  FeedbackComment.findById(req.body.comment._id, function (err, comment) {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    if (comment === null) {
      return res.status(404).json("comment not found");
    }

    if (req.body.comment.text) comment.text = req.body.comment.text;
    if (req.body.comment.audioId) comment.audioId = req.body.comment.audioId;
    if (req.body.comment.range) comment.range = req.body.comment.range;
    comment.lastUpdated = new Date();

    comment.save().then(
      () => res.json("Update complete"),
      (err) => res.status(400).json(err)
    );
  });
}
