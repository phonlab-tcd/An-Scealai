const User            = require('../../model/user');
// const { API404Error } = require('../../util/APIError');
const { API400Error } = require('../../util/APIError');

function sanitizeUser(u){
  const username  = u.username;
  const _id       = u._id;
  const role      = u.role;
  return {username,_id,role};
}

function asNum(x) {
  return Number(x) || parseInt(x);
}

function makeReqBody(req) {
  const limit = (()=>{
    const l = asNum(req.body.limit);
    return l ? l : 20;
  })();
  const currentPage = (()=>{
    const num = asNum(req.body.currentPage);
    if(isNaN(num)) return 0;
    else return num;
  })();
  const searchString = req.body.searchString ? req.body.searchString : '';
  const defaultRoles = ['STUDENT','TEACHER','ADMIN'];
  function validRoles(r) {
    if (Array.isArray(r)) return r;
    if (defaultRoles.includes(r)) return [r.toUpperCase()];
    return defaultRoles;
  }
  const roles = validRoles(req.body.roles);
  if (isNaN(limit) || limit <= 0 )            throw new API400Error('limit must be greater than 0');
  if (isNaN(currentPage) || currentPage < 0)  throw new API400Error('currentPage must be 0 or greater');
  return { searchString, limit, currentPage, roles };
}

function query(searchString, roles) {
  const username = {$regex: new RegExp(searchString, 'i')};
  const role    = {$in: roles};
  return {username,role};
}

function paginateUsers(currentPage,limit,query) {
  return User
      .find(query)
      .sort({username: "asc"})
      .skip(currentPage * limit)
      .limit(limit);
}

function empty(res) {
  return res.json({users: [], count: 0});
}

/**
 * Search for users in the DB whose usernames match a search string.
 * Uses pagination to prevent too many DB operations at once.
 * See: https://stackoverflow.com/a/61354694
 */
async function searchUser(req, res) {
  const validatedQuery    = makeReqBody(req);
  console.log(validatedQuery);
  const {searchString,roles,currentPage,limit} = validatedQuery;
  const mongoQuery        = query(searchString, roles);
  const paginatedUsers    = paginateUsers(currentPage,limit,mongoQuery);
  const userCount         = User.where(mongoQuery).countDocuments();
  const [usersFull,count] = await Promise.all([paginatedUsers, userCount]);
  if (!usersFull)           return empty(res);
  const users             = usersFull.map(sanitizeUser);
  return                    res.json({users,count,validatedQuery});
}

module.exports = searchUser;
