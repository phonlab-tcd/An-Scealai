import { Request, Response } from 'express';
import FeedbackComment from '../../models/feedbackComment';

export default async function createFeedbackComment(req: Request, res: Response) {
  const comment = new FeedbackComment({...req.body.comment, lastUpdated: new Date()});

  comment.save()
  .then(() => {
    return res.json(comment);
  })
  .catch((err) => {
    console.log(err);
    return res.status(400).send("Unable to save feedback comment to DB");
  });
}