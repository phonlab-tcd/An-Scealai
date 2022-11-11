const Story = require('../../models/story');
const {API404Error} = require('../../utils/APIError');

/**
 * Get given student's stories written whithen the given date range
 * @param {Object} req The student's id number
 * @param {Object} res The object to store the response
 * @return {Object} Student's stories within date range
 */
module.exports = async (req, res) => {
  const conditions = {'owner': req.params.studentId};
  if (req.body.startDate !== '' && req.body.endDate !== '') {
    conditions['lastUpdated'] = {
      '$gte': req.body.startDate,
      '$lte': req.body.endDate,
    };
  };

  const stories = await Story.find(conditions);

  if (!stories) {
    throw new API404Error(`No stories written by user with 
      id ${req.params.studentId} were found.`);
  }

  if (stories.length > 0) {
    res.status(200).json(stories);
  } else {
    res.status(200).json([]);
  }
};
