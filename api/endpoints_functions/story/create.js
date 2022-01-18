const Story = require('../../models/story');
const {API500Error} = require('../../utils/APIError');

module.exports = async (req, res) => {
    const story = await Story.create(req.body);
    if (!story) {
        throw new API500Error('Unable to save story to DB.')
    }
    res.status(200).json({id: story._id});
}
