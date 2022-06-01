const Story = require('../../model/story');
const {API404Error} = require('../../util/APIError');
const mongoose = require('mongoose');

module.exports = async (req, res) => {
  if (! mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      invalidObjectId: req.params.id,
    });
  }
  const story = await Story.findById(req.params.id);
  if (story) {
    story.feedback.seenByStudent = true;
    story.save();
    return res.status(200).json({
      message: 'Feedback viewed successfully',
    });
  }

  throw new API404Error(
      'Could not find a story with id ' + req.params.id);
};
