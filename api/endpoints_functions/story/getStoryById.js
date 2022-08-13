const Story = require('../../models/story');
const {API404Error} = require('../../utils/APIError');

module.exports = async (req, res, next) => {
  if(!req.user) return res.status(400).json('need to know user');
  if(!req.user._id) return res.status(400).json('need to know user\'s id');
  const story = await Story.findOne({_id: req.params.id, owner: req.user?._id});
  console.log('story',story);
  if (!story) return res.status(404).json(`Story with id ${req.params.id} by user ${req.user._id} not found`);
  return res.json(story);
}
