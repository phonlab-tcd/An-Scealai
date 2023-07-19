import { Request, Response } from "express";
import FeedbackComment from "../../models/feedbackComment";
const { API404Error } = require("../../utils/APIError");

export default async function getFeedbackComments(req: Request, res: Response) {
  FeedbackComment.find({ storyId: req.params.storyId })
    .then((comments) => {
      return res.status(200).json(comments);
    })
    .catch(() => {
      throw new API404Error(`Comments not found.`);
    });
}
