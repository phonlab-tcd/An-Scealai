const AbstractCommand = require('../utils/AbstractCommand');
const APIError = require('../utils/APIError');
const Story = require('../models/story');

const getStoryById = new AbstractCommand(async (req, res) => {
    const story = await Story.findById(req.params.id);
    if (!story) {
        throw new APIError(`Story with id ${req.params.id} not found.`, 404);
    }
    res.status(200).json(story);
});

module.exports = getStoryById;