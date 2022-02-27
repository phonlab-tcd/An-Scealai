const Story = require('../../models/story');
module.exports = (req, res, next) => {
  const story = new Story(req.body);
  story.feedback.seenByStudent = null;
  story.feedback.text = null;
  story.feedback.audioId = null;
  story.save().then((story) => {
    res.status(200).json({
      story: 'story added successfully',
      id: story._id,
    });
  }).catch((err) => next(err))
}
