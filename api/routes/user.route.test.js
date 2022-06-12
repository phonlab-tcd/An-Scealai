const app = require('../server');
const supertest = require('supertest');
const request = supertest(app);
const {removeAllCollections} = require('../utils/test-utils');
const mongoose = require('mongoose');
const User = require('../models/user');
const random = require('../utils/random');

// afterEach(async () => {
//   await removeAllCollections();
// });

describe('user routes', () => {
  describe('user/searchUser/:searchString/:currentPage/:limit', () => {
    it('returns a user if their username matches the search string', async () => {
      const prefix = random.string();
      const users = await User.create([
          {username: prefix + 'alice'},
          {username: prefix + 'bob'  },
          {username: prefix + 'carl' },
      ]);
      const SEARCH_STRING = prefix;
      const res = await request
        .post(`/user/searchUser/`)
        .send({searchString: SEARCH_STRING});
      expect(res.status).toBe(200);
      expect(res.body.users[0].username).toBe(users[0].username);
    });

    it('limits the number of users returned', async () => {
      const prefix = random.string();
      await User.create([
          {username: prefix + 'alice'},
          {username: prefix + 'bob'  },
          {username: prefix + 'carl' },
      ]);
      const SEARCH_STRING = prefix;
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
      expect(res.body.users.length).toBe(LIMIT);
    });

    it('allows skipping through pages of results', async () => {
      const prefix = random.string();
      const [_,bob] = await User.create([
          {username: prefix + 'alice'},
          {username: prefix + 'bob'  },
          {username: prefix + 'carl' },
      ]);
      const SEARCH_STRING = prefix;
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
      expect(res.body.users[0]._id).toBe(bob._id.toString());
    });

    it('allows filtering by user role', async () => {
      const prefix = random.string();
      const users = await User.create([
          {username: prefix + 'alice', role: 'TEACHER'},
          {username: prefix + 'bob'  , role: 'STUDENT'},
          {username: prefix + 'carl' , role: 'ADMIN'},
      ]);
      const SEARCH_STRING = prefix;
      const res = await request
        .post('/user/searchUser')
        .send({
          searchString: SEARCH_STRING,
          roles: ['STUDENT', 'ADMIN']
        });

      expect(res.status).toBe(200);
      expect(res.body.users[0].username).toBe(users[1].username);
      expect(res.body.users[1].username).toBe(users[2].username);
    });

    it('returns total count of results matching the search params', async () => {
      const prefix = random.string();
      const users = await User.create([
          {username: prefix + 'alice'},
          {username: prefix + 'bob'  },
          {username: prefix + 'carl' },
      ]);
      const SEARCH_STRING = prefix;
      const LIMIT = 1
      const res = await request
        .post('/user/searchUser')
        .send({
          searchString: SEARCH_STRING,
          limit: LIMIT
        });

      expect(res.status).toBe(200);
      // limited to 1 result, but total count is 3, 
      // because 3 usernames contain an 'a'
      expect(res.body.count).toBe(3);
    });
  });
});
