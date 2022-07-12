const app               = require('../../app_factory')();
const supertest         = require('supertest');
const request           = supertest.agent(app);
const User              = require('../../model/user');
const randomString      = require('../../util/randomString');
const url = '/user/searchUser';

describe('sanity check', function sanityCheck() {
  it('always passes', function alwaysPasses() {
    expect(true);
  });
});

describe('searchUser endpoint function', () => {
  it('empty array if no users match', async function() {
    const searchString = '-------';
    const body = {searchString};
    await request.post(url)
      .send(body)
      .expect(200)
      .then(res=>{
        expect(res.body.users).toStrictEqual([]);
        expect(res.body.count).toStrictEqual(0);
      });
  });

  it('should return list of users', async () => {
    const makeUserQuery = randomUsers();
    await User.create(makeUserQuery);
    await request.post(url)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res)=>{
        const usernames = res.body.users.map(u=>u.username);
        makeUserQuery.forEach(u=>{
          expect(usernames.includes(u.username));
        });
      });
  });

  it('should paginate users correctly', async () => {
    const searchString = randomString();
    const sorted = Array(100).map(idx=>{return {username: searchString+idx}});
    await User.create(sorted);
    const limit = 25;
    const assertions = Array(4).map(currentPage=>{
      request.post(url)
        .send({currentPage,limit,searchString})
        .then(res=>{
          expect(res.body.users.length).toBe(limit);
          expect(res.body.users[0].username).toBe(searchString + (currentPage*limit));
        });
    });
    await Promise.all(assertions);
  });

  it('should throw 400 error if currentPage is < 0', async () => {
    const currentPage = "-1";
    const body = {currentPage};
    await request.post(url)
      .send(body)
      .expect(400);
  });

  it('status 400 if limit is < 0', async () => {
    const body = {limit: '-1'};
    await request.post(url)
      .send(body)
      .expect(400);
  });
});

const randomUsers = () => {
  const names = [...Array(10).keys()].map(_=>randomString());
  return names.map(username=>{return {username}});
}
