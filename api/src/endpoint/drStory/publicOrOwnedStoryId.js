const DigitalReaderStory = require('../../models/drStory');
const mongoose = require('mongoose');

/**
 * Set feedback status of story to 'viewed'
 * @param {Object} req user: User information; params: story ID
 * @param {Object} res
 * @param {Object} next
 * @return {Promise} Story object
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

  const story = await DigitalReaderStory.findById(new mongoose.mongo.ObjectId(req.params.id));
  if (!story) return no();
  
  if (story.public) return yes();

  // if the story is private - but the current user is its owner, return the story
  if (story.owner.toString() === req.user._id) return yes();
  
  return no(401, 'not authorised');
};
