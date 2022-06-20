const Story = require('../../model/story');
const {API404Error} = require('../../util/APIError');

module.exports = async (req, res) => {
  const story = await Story.findById(req.params.id);
  if (!story) {
    throw new API404Error(`Story with id ${req.params.id} not found`);
  }
  return res.status(200).json(story);
}
