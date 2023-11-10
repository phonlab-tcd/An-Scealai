import { Request, Response } from "express";
import FeedbackComment from "../../models/feedbackComment";

export default async function getFeedbackStats(req: Request, res: Response) {
    const totalFeedbackComments = await FeedbackComment.countDocuments();
    const feedbackCommentsJustText = await FeedbackComment.where({'text': {$ne: null}, 'audioId': {$eq: null}}).countDocuments();
    const feedbackCommentsJustAudio = await FeedbackComment.where({'audioId': {$ne: null}, 'text': {$eq: null}}).countDocuments();
    const feedbackCommentsWithTextAndAudio = await FeedbackComment.where({'audioId': {$ne: null}, 'text': {$ne: null}}).countDocuments();

    return res.status(200).json({
        totalFeedbackComments: totalFeedbackComments,
        feedbackCommentsJustText: feedbackCommentsJustText,
        feedbackCommentsJustAudio: feedbackCommentsJustAudio,
        feedbackCommentsWithTextAndAudio: feedbackCommentsWithTextAndAudio
      });
}
