const Story = require('../../models/story');
const {API404Error} = require('../../utils/APIError');

// get stories by owner (user) ID
module.exports = async (req, res) => {
  const stories = await Story.find({'owner': req.params.id});
  if (!stories) {
    throw new API404Error(`No stories written by user with id ${req.params.id} were found.`);
  }
  return res.status(200).json(stories);
};
