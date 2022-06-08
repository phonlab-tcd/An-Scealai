import Express from 'express';
import { Role } from '../../../../ngapp/src/role';
export type SearchUserEndpoint = {
  users: SanitizedUser[];
  count:number;
  validatedQuery: SearchUserQueryBody
};
export type SearchUserQueryBody = {
  searchString:string;
  currentPage:number;
  limit:number;
  roles: Role[];
};
export type SanitizedUser = {
  username:string;
  _id:string;
  language:string;
  role: Role;
  status: 'Active' | 'Pending';
};

const User            = require('../../model/user');
// const { API404Error } = require('../../util/APIError');
const { API400Error } = require('../../util/APIError');


function sanitizeUser(u: typeof User): SanitizedUser{
  const username  = u.username;
  const _id       = u._id;
  const role      = u.role;
  const status    = u.status;
  const language  = u.language;
  return {username,_id,role,status,language};
}

function asNum(x: any) {
  return Number(x) || parseInt(x);
}

function makeReqBody(req: Express.Request) {
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
  const defaultRoles: Role[] = ['STUDENT','TEACHER','ADMIN'];
  function validRoles(r: any): Role[] {
    if (Array.isArray(r)) return r;
    if (defaultRoles.includes(r)) return [r.toUpperCase()];
    return defaultRoles;
  }
  const roles = validRoles(req.body.roles);
  if (isNaN(limit) || limit <= 0 )            throw new API400Error('limit must be greater than 0');
  if (isNaN(currentPage) || currentPage < 0)  throw new API400Error('currentPage must be 0 or greater');
  return { searchString, limit, currentPage, roles };
}

type MongoQuery = {
  username: {$regex: RegExp };
  role:     {$in: Role[]};
}

function query(searchString: string, roles: Role[]): MongoQuery {
  const username = {$regex: new RegExp(searchString, 'i')};
  const role    = {$in: roles};
  return {username,role};
}

function paginateUsers(currentPage:number,limit:number,query:MongoQuery) {
  return User
      .find(query)
      .sort({username: "asc"})
      .skip(currentPage * limit)
      .limit(limit);
}

function empty(res: Express.Response,validatedQuery: SearchUserQueryBody):
  Express.Response<SearchUserEndpoint> {
  const users: SanitizedUser[] = [];
  const count = 0;
  return res.json({users,count,validatedQuery});
}


// Search for users in the DB whose usernames match a search string.
// Uses pagination to prevent too many DB operations at once.
// See: https://stackoverflow.com/a/61354694
type EReq = Express.Request;
type ERes = Express.Response;
type Res  = Promise<Express.Response<SearchUserEndpoint>>;
export async function searchUser(req: EReq, res: ERes): Res{
  const validatedQuery = makeReqBody(req);
  const {searchString, roles, currentPage, limit} = validatedQuery;
  const mongoQuery = query(searchString, roles);
  const paginatedUsers = paginateUsers(currentPage, limit, mongoQuery);
  const userCount = User.where(mongoQuery).countDocuments();
  const [usersFull, count] = await Promise.all([paginatedUsers, userCount]);
  if (!usersFull) return empty(res, validatedQuery);
  const users = usersFull.map(sanitizeUser);
  return res.json({users, count, validatedQuery});
}
