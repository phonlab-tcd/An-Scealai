const makeEndpoints = require('../utils/makeEndpoints');

import createFeedbackComment from "../endpoints_functions/feedback/createFeedbackComment";
import getFeedbackComments from "../endpoints_functions/feedback/getFeedbackComments";
import updateFeedbackComment from "../endpoints_functions/feedback/updateFeedbackComment";
import deleteFeedbackComment from "../endpoints_functions/feedback/deleteFeedbackComment";


module.exports = makeEndpoints({
  post: {
    '/createNewComment': createFeedbackComment,
    '/getFeedbackComments': getFeedbackComments,
    '/updateFeedbackComment': updateFeedbackComment,
  },
  get: {
    '/deleteFeedbackComment/:id': deleteFeedbackComment,
  },
});
