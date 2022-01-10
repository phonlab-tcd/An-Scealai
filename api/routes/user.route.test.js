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
        const res = await request.get(`/user/searchUser/${SEARCH_STRING}/0/1`);
  
        expect(res.status).toBe(200);
        expect(res.body[0].username).toBe(users[0].username);
    });

    it('limits the number of users returned', async () => {
        const users = await User.create([
            {username: 'alice'},
            {username: 'bob'},
            {username: 'carl'},
        ]);

        const SEARCH_STRING = 'a'
        const LIMIT = 2
        const res = await request.get(`/user/searchUser/${SEARCH_STRING}/0/${LIMIT}`);

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(LIMIT);
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
        const res = await request.get(`/user/searchUser/${SEARCH_STRING}/${PAGE_NUMBER}/${LIMIT}`);

        expect(res.status).toBe(200);
        // 2 names match 'a': [alice, carl]
        // We limit page size to 1, and are on the 2nd page --> carl.
        expect(res.body[0].username).toBe('carl');
    });
  });
});