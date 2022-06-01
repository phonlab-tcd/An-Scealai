const User            = require('../../model/user');
// const { API404Error } = require('../../util/APIError');
const { API400Error } = require('../../util/APIError');

function asNum(x) {
  return Number(x) || parseInt(x);
}

function makeReqBody(req) {
  const limit = (()=>{
    const l = asNum(req.body.limit);
    return l ? l : 20;
  })();
  const currentPage = (()=>{
    return asNum(req.body.currentPage);
  })();
  const searchString = req.body.searchString ? req.body.searchString : '';
  const roles = req.body.roles ? req.body.roles : [
    'STUDENT',
    'TEACHER',
    'ADMIN'
  ];

  // Some parameter validation
  if (isNaN(limit) || limit <= 0 || currentPage < 0)
    throw new API400Error('currentPage and limit parameters must be greater than 0.');
  return { searchString, limit, currentPage, roles };
}

/**
 * Search for users in the DB whose usernames match a search string.
 * Uses pagination to prevent too many DB operations at once.
 * See: https://stackoverflow.com/a/61354694
 */
async function searchUser(req, res) {
  const body = makeReqBody(req);
  
  if (!Array.isArray(body.roles)) {
    throw new API400Error('roles param must be an array of user role strings.');
  }

  // find username containing searchRegex as substring
  const searchRegex = new RegExp(body.searchString, 'i'); // i for case insensitive
  const mongoQuery = {
    username: {$regex: searchRegex},
    role: {$in: body.roles}
  };
  const [users,userCount] = await Promise.all([
    User.find(mongoQuery)
        .sort({ username: "asc" })
        // skip first N users, if navigating through multiple pages
        .skip(body.currentPage * body.limit)
        .limit(body.limit),
    User.where(mongoQuery).countDocuments(),
  ]);

  if (!users) {
    return res.json({users: [], count: 0});
    // throw new API404Error(`No users matching the search string were found.`);
  }
  console.dir(users);
  return res.status(200).json({users: users, count: userCount});
}

module.exports = searchUser;
