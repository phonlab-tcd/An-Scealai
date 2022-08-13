const Story = require('../../models/story');
const {API404Error} = require('../../utils/APIError');

/** // DEPRECATED
 * @returns a list of stories written by the 'author' param
 */
module.exports = async (req, res) => {
  const stories = await Story.find({"author": req.params.author});
  if (!stories) {
    throw new API404Error(`No stories written by ${req.params.author} were found.`);
  }
  return res.status(200).json(stories);
}
