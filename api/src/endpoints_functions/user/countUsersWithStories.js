const User = require('../../models/user');
const Story = require('../../models/story');

/**
* Returns the number of students who have written at least one story
* @param {Object} req
* @param {Object} res
* @return {Promise} Number of students who have at least one story
*/
async function countUsersWithStories(req, res) {
  const users = await User.find({'role': 'STUDENT'}, {'username': 1, '_id': 0});
  const usernames = users.map( (item) => {return item.username});

  let usersWithStories = 0;

  // count the number of users that have written at least one story
  for (const user of usernames) {
    const numOfStories = await Story.find({'author': user}).countDocuments();

    if (numOfStories > 0) {
      usersWithStories++;
    }
  }

  return res.status(200).json(usersWithStories);
}

module.exports = countUsersWithStories;
