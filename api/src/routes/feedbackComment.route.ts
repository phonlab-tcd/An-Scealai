const makeEndpoints = require('../utils/makeEndpoints');

import createFeedbackComment from "../endpoint/feedback/createFeedbackComment";
import getFeedbackComments from "../endpoint/feedback/getFeedbackComments";
import updateFeedbackComment from "../endpoint/feedback/updateFeedbackComment";
import deleteFeedbackComment from "../endpoint/feedback/deleteFeedbackComment";
import addAudioFeedback from "../endpoint/feedback/addAudioFeedback";
import getAudioFeedback from '../endpoint/feedback/getAudioFeedback';
import deleteFeedbackCommentsForOwner from "../endpoint/feedback/deleteFeedbackCommentsForOwner";
import deleteFeedbackCommentsForStory from "../endpoint/feedback/deleteFeedbackCommentsForStory";
import getFeedbackStats from "../endpoint/feedback/getFeedbackStats";

export default makeEndpoints({
  post: {
    '/createNewComment': createFeedbackComment,
    '/updateFeedbackComment': updateFeedbackComment,
    '/addAudioFeedback/:id': addAudioFeedback,
  },
  get: {
    '/deleteFeedbackComment/:id': deleteFeedbackComment,
    '/deleteFeedbackCommentsForOwner/:ownerId': deleteFeedbackCommentsForOwner,
    '/deleteFeedbackCommentsForStory/:storyId': deleteFeedbackCommentsForStory,
    '/getFeedbackComments/:storyId': getFeedbackComments,
    '/getAudioFeedback/:id': getAudioFeedback,
    '/getFeedbackStats': getFeedbackStats,
  },
});
