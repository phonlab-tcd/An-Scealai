const Story = require('../../models/story');

/**
 * Set feedback status of story to 'viewed'
 * @param {Object} req user: User information; params: story ID
 * @param {Object} res
 * @param {Object} next
 * @return {Object} Story object
 */
module.exports = async (req, res, next) => {
  function yes() {
    res.json(story);
  }
  function no(status=404, msg='not found') {
    res.status(status).json(msg);
  }
  if (!req.user) return no(400, 'need to know user');
  if (!req.user._id) return no(400, 'need to know user\'s id');
  const story = await Story.findById(req.params.id);
  if (!story) return no();
  if (story.studentId === req.user._id || story.owner === req.user._id) return yes();
  return no();
};
