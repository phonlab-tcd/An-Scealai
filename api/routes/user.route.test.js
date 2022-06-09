const request                 = require('supertest')(require('../server'));
const randomString            = require('../utils/randomString');
const User                    = require('../models/user');

describe('user routes', () => {
  const url = '/user/searchUser';
  describe(`POST ${url}`, () => {
    function alice_bob_carl() {
      const suffix = randomString();
      function to(username){return {username: username+suffix}}
      const users = ['alice','bob','carl'].map(to);
      return {users,suffix};
    }
    function differentRoles({users,suffix}) {
      const roles = ['STUDENT','TEACHER','ADMIN'];
      users = users.map((u,i)=>{u.role=roles[i%3];return u;});
      return {users,suffix};
    }
    it('returns a user if their username matches the search string', async () => {
      const {users,suffix} = alice_bob_carl();
      await User.create(users);
      const searchString = suffix;
      const res = await request
        .post(url)
        .send({searchString})
        .expect(200);;
      expect(res.body.users[0].username).toBe(users[0].username);
    });

    it('limits the number of users returned', async () => {
      const {users,suffix} = alice_bob_carl();
      await User.create(users);
      const searchString = suffix;
      const limit = 2
      const res = await request
        .post(url)
        .send({searchString,limit})
        .expect(200);
      expect(res.body.users.length).toBe(limit);
    });

    it('allows skipping through pages of results', async () => {
      const {users,suffix} = alice_bob_carl();
      await User.create(users);
      const searchString = suffix;
      const limit = 1;
      const currentPage = 1;
      const res = await request
        .post(url)
        .send({searchString,limit,currentPage})
        .expect(200);
      expect(res.body.users[0].username).toBe(users[1].username);
    });

    it('allows filtering by user role', async () => {
      const {users,suffix} = differentRoles(alice_bob_carl());
      console.log(users);
      await User.create(users);
      const searchString = suffix;
      const roles = ['STUDENT','ADMIN'];
      const res = await request
        .post(url)
        .send({searchString,roles})
        .expect(200);
      console.log(res.body.users);
      expect(res.body.users.length).toBe(2);
    });

    it('returns total count of results matching the search params', async () => {
      const {users,suffix} = alice_bob_carl();
      await User.create(users);
      const searchString = suffix;
      const res = await request
        .post(url)
        .send({searchString,limit})
        .expect(200);
      expect(res.body.count).toBe(3);
    });
  });
});
