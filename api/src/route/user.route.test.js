const User = require('../model/user');
const randomString = require('../util/randomString');
const { removeCollection } = require('../util/test-utils');

const app = require('../server');
const request = require('supertest').agent(app);

beforeAll(async ()=>{
  await User.deleteMany({username: {$regex: '00000' }});
});

describe('user routes', () => {
  describe('user/searchUser/:searchString/:currentPage/:limit', () => {
    const url = '/user/searchUser/';
    it('return a user ', async () => {
      const randomUsers = Array(5).fill(undefined)
        .map(_=>{return {username: randomString()}});
      console.log(randomUsers);
      randomUsers[0].username = '0000000' + randomUsers[0].username;
      await User.create(randomUsers);
      const { body } = await request
        .post(url)
        .send({searchString: randomUsers[0]})
        .expect(200);
      const { users } = body;
      expect(users[0].username).toBe(randomUsers[0].username);
    });

    it('limits the number of users returned', async () => {
      const searchString = randomString();
      const users = ['alice','bob','carl'].map(u=>{return {username: searchString+u}});
      await User.create(users);
      const limit = 2
      const res = await request
        .post(url)
        .send({searchString,limit});
      expect(res.status).toBe(200);
      expect(res.body.users.length).toBe(limit);
    });

    it('allows skipping through pages of results', async () => {
      const searchString = randomString();
      const users = await User.create([
          {username: searchString + 'alice'},
          {username: searchString + 'bob'},
          {username: searchString + 'carl'},
      ]);
      const limit = 1;
      const currentPage = 1;
      const body = {searchString,limit,currentPage};
      const res = await request
        .post(url)
        .send(body)
        .expect(200);
      expect(res.body.users[0].username).toBe(searchString + 'bob');
    });

    it('allows filtering by user role', async () => {
      const searchString = randomString();
      const users = await User.create([
          {username: searchString + 'alice', role: 'TEACHER'},
          {username: searchString + 'boba', role: 'STUDENT'},
          {username: searchString + 'carl', role: 'ADMIN'},
      ]);

      const roles = ['STUDENT', 'ADMIN'];
      const body = {searchString,roles};
      const res = await request
        .post(url)
        .send(body)
        .expect(200);
      expect(res.body.users[0].username).toBe(searchString + 'boba');
      expect(res.body.users[1].username).toBe(searchString + 'carl');
    });

    it('returns total count of results matching the search params', async () => {
      const searchString = randomString();
      const users = ['alice','boba','carl']
        .map(n=>{return{username: searchString+n}});
      await User.create(users);
      const limit = 1;
      const body = {searchString,limit};
      const res = await request
        .post(url)
        .send(body)
        .expect(200);

      expect(res.status).toBe(200);
      // limited to 1 result, but total count is 3, 
      // because 3 usernames contain an 'a'
      expect(res.body.count).toBe(3);
    });
  });
});
