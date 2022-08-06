const Story = require('../../models/story.cjs');
const {API500Error} = require('../../utils/APIError.cjs');

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
    if (!story) {
        throw new API500Error('Unable to save story to DB.')
    }
    res.status(200).json({id: story._id});
}
