const Story = require('../../models/story');
const {API404Error} = require('../../utils/APIError');
const mongoose = require('mongoose');

/**
 * Set feedback status of story to 'viewed'
 * @param {Object} req params: Story ID
 * @param {Object} res
 * @return {Object} Success or Error Message
 */
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
