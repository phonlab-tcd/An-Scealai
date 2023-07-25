const makeEndpoints = require('../utils/makeEndpoints');

import createFeedbackComment from "../endpoint/feedback/createFeedbackComment";
import getFeedbackComments from "../endpoint/feedback/getFeedbackComments";
import updateFeedbackComment from "../endpoint/feedback/updateFeedbackComment";
import deleteFeedbackComment from "../endpoint/feedback/deleteFeedbackComment";
import addAudioFeedback from "../endpoint/feedback/addAudioFeedback";
import getAudioFeedback from '../endpoint/feedback/getAudioFeedback';

export default makeEndpoints({
  post: {
    '/createNewComment': createFeedbackComment,
    '/updateFeedbackComment': updateFeedbackComment,
    '/addAudioFeedback/:id': addAudioFeedback,
  },
  get: {
    '/deleteFeedbackComment/:id': deleteFeedbackComment,
    '/getFeedbackComments/:storyId': getFeedbackComments,
    '/getAudioFeedback/:id': getAudioFeedback,
  },
});
