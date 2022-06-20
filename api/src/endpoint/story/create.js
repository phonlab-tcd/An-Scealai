const Story = require('../../model/story');
const ERROR = require('../../util/APIError');

/**
 * Creates a new story document on the DB.
 * 
 * @param req {
 *     body: Story object
 * }
 * @returns {id: the id of the created story}
 */
module.exports = async (req, res) => {
  const story = await Story.create(req.body);
  if (!story) throw new ERROR.API500Error('Unable to save story to DB.')
  res.json({id: story._id});
}
