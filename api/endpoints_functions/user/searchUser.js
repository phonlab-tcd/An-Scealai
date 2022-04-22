const User = require('../../models/user');
const {API404Error, API400Error} = require('../../utils/APIError');

/**
 * Search for users in the DB whose usernames match a search string.
 * Uses pagination to prevent too many DB operations at once.
 * See: https://stackoverflow.com/a/61354694
 */
async function searchUser(req, res) {
  // default values for req body
  reqBody = {
    searchString: req.body.searchString ? req.body.searchString : '',
    limit: req.body.limit ? req.body.limit : 20,
    currentPage: req.body.currentPage ? req.body.currentPage : 0,
    roles: req.body.roles ? req.body.roles : [
      'STUDENT',
      'TEACHER',
      'ADMIN'
    ]
  };

  // '+' operator casts to Number
  limit = +reqBody.limit
  page = +reqBody.currentPage
  
  // Some parameter validation
  if (limit < 0 || page < 0) {
    throw new API400Error('currentPage and limit parameters must be greater than 0.');
  }
  if (!Array.isArray(reqBody.roles)) {
    throw new API400Error('roles param must be an array of user role strings.');
  }

  // find username containing searchRegex as substring
  const searchRegex = new RegExp(reqBody.searchString, 'i'); // i for case insensitive
  const mongoQuery = {
    username: {$regex: searchRegex},
    role: {$in: reqBody.roles}
  };
  const users = await User.find(mongoQuery)
    .sort({ username: "asc" })
    // skip first N users, if navigating through multiple pages
    .skip(page * limit)
    .limit(limit); // only return K users
  const userCount = await User.where(mongoQuery).countDocuments()

  if (!users) {
    throw new API404Error(`No users matching the search string were found.`);
  }
  return res.status(200).json({users: users, count: userCount});
}

module.exports = searchUser;
