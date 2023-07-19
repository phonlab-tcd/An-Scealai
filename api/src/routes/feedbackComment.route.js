const makeEndpoints = require('../utils/makeEndpoints');

import createFeedbackComment from "../endpoints_functions/feedback/createFeedbackComment";
import getFeedbackComments from "../endpoints_functions/feedback/getFeedbackComments";
import updateFeedbackComment from "../endpoints_functions/feedback/updateFeedbackComment";
import deleteFeedbackComment from "../endpoints_functions/feedback/deleteFeedbackComment";
import addAudioFeedback from "../endpoints_functions/feedback/addAudioFeedback";
import getAudioFeedback from '../endpoints_functions/feedback/getAudioFeedback';


module.exports = makeEndpoints({
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
