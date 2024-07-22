const DigitalReaderStory = require('../../models/drStory');
const {API500Error} = require('../../utils/APIError');

/**
 * Creates a new story document on the DB.
 * @param {Object} req body: Story object
 * @param {Object} res
 * @return {Promise} id: the id of the created story
 */
module.exports = async (req, res) => {
  //res.json({text : 'anything at all'})
  const drStory = await DigitalReaderStory.create({...req.body, owner: req.user._id});
  if (!drStory) {
    throw new API500Error('Unable to save story to DB.');
  }
  res.status(200).json({id: drStory._id});
};
