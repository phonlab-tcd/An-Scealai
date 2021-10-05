const Story = require('../../models/story');
const {API404Error} = require('../../utils/APIError');

async function getStoryById(req, res) {
  const story = await Story.findById(req.params.id);
  if (!story) {
    throw new API404Error(`Story with id ${req.params.id} not found`);
  }
  console.dir(story);
  return res.status(200).json(story);
}

module.exports = getStoryById;
