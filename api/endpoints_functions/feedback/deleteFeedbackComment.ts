import { Request, Response } from "express";
import FeedbackComment from "../../models/feedbackComment";

export default async function deleteFeedbackComment( req: Request, res: Response ) {
  FeedbackComment.findOneAndRemove(req.params.id, function (err, comment) {
    if (err) {
      console.log(err);
      res.json(err);
    } else res.json("Successfully deleted comment");
  });
}
