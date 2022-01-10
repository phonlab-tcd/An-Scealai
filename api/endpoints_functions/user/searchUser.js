const User = require('../../models/user');
const {API404Error, API400Error} = require('../../utils/APIError');

/**
 * Search for users in the DB whose usernames match a search string.
 * Uses pagination to prevent too many DB operations at once.
 * See: https://stackoverflow.com/a/61354694
 */
async function searchUser(req, res) {
  // '+' operator casts to Number
  limit = +req.params.limit
  page = +req.params.currentPage
  // skip and limit must be non-negative
  if (limit < 0 || page < 0) {
    console.log('\n\n\nIT RAN\n\n\n')
    throw new API400Error('currentPage and limit parameters must be greater than 0.');
  }
  // find username containing searchRegex as substring
  const searchRegex = new RegExp(req.params.searchString, 'i'); // i for case insensitive
  const users = await User.find({username: {$regex: searchRegex}})
                        .sort({ username: "asc" })
                        // skip first N users, if navigating through multiple pages
                        .skip(page * limit)
                        .limit(limit); // only return K users
                        
  if (!users) {
    throw new API404Error(`No users with substring ${req.params.searchString} were found.`);
  }
  console.dir(users);
  return res.status(200).json(users);
}

module.exports = searchUser;
