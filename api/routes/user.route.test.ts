const app = require('../server');
const supertest = require('supertest');
const request = supertest(app);
const {removeAllCollections} = require('../utils/test-utils');
const mongoose = require('mongoose');
const User = require('../models/user');
afterEach(async () => {
  await removeAllCollections();
});

describe('user routes', () => {
  describe('user/searchUser/:searchString/:currentPage/:limit', () => {
    it('returns a user if their username matches the search string', async () => {
        const users = await User.create([
            {username: 'alice'},
            {username: 'bob'},
            {username: 'carl'},
        ]);

        const SEARCH_STRING = 'a'
        const res = await request.post(`/user/searchUser/`, {searchString: SEARCH_STRING});
  
        expect(res.status).toBe(200);
        expect(res.body.users[0]).toBeDefined();
        expect(res.body.users[0].username).toBe(users[0].username);
    });

    it('limits the number of users returned', async () => {
        const users = await User.create([
            {username: 'alice'},
            {username: 'boba'},
            {username: 'carl'},
        ]);

        const SEARCH_STRING = 'a'
        const LIMIT = 2
        const res = await request.post(
          `/user/searchUser`,
        ).send(
          {
            searchString: SEARCH_STRING,
            limit: LIMIT
          }
        );

        expect(res.status).toBe(200);
        expect(res.body.users.length).toEqual(LIMIT);
    });

    it('allows skipping through pages of results', async () => {
        const users = await User.create([
            {username: 'alice'},
            {username: 'bob'},
            {username: 'carl'},
        ]);

        const SEARCH_STRING = 'a'
        const LIMIT = 1
        const PAGE_NUMBER = 1
        const res = await request.post(
          `/user/searchUser`
        ).send(
          {
            searchString: SEARCH_STRING,
            limit: LIMIT,
            currentPage: PAGE_NUMBER
          }
        );

        expect(res.status).toBe(200);
        // 2 names match 'a': [alice, carl]
        // We limit page size to 1, and are on the 2nd page --> carl.
        expect(res.body.users[0].username).toBe('carl');
    });

    it('allows filtering by user role', async () => {
      const users = await User.create([
          {username: 'alice', role: 'TEACHER'},
          {username: 'boba', role: 'STUDENT'},
          {username: 'carl', role: 'ADMIN'},
      ]);

      const SEARCH_STRING = 'a'
      const res = await request.post(
        `/user/searchUser`
      ).send(
        {
          searchString: SEARCH_STRING,
          roles: ['STUDENT', 'ADMIN']
        }
      );

      expect(res.status).toBe(200);
      expect(res.body.users[0]).toBeDefined();
      expect(res.body.users[1]).toBeDefined();
      res.body.users.sort((a,b)=>(a.username > b.username)?1:((b.username > a.username)?-1:0));
      expect(res.body.users[0].username).toBe('boba');
      expect(res.body.users[1].username).toBe('carl');
    });

    it('returns total count of results matching the search params', async () => {
      await User.create([
          {username: 'alice'},
          {username: 'boba'},
          {username: 'carl'},
      ]);

      const SEARCH_STRING = 'a'
      const LIMIT = 1
      const res = await request.post(
        `/user/searchUser`
      ).send(
        {
          searchString: SEARCH_STRING,
          limit: LIMIT
        }
      );

      expect(res.status).toBe(200);
      // limited to 1 result, but total count is 3, 
      // because 3 usernames contain an 'a'
      expect(res.body.count).toBe(3);
    });
  });
});
