const Story = require('../../models/story.cjs');
const {API404Error} = require('../../utils/APIError.cjs');

module.exports = async (req, res) => {
  const story = await Story.findById(req.params.id);
  if (!story) {
    throw new API404Error(`Story with id ${req.params.id} not found`);
  }
  return res.status(200).json(story);
}
