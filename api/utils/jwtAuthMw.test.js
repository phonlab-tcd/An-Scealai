const { randomString } = require('./randomString');
const jwt              = require('jsonwebtoken');
const supertest        = require('supertest');

supertest.Test.prototype.setJwt = function(token) {
  return this.set('Authorization', `Bearer ${token}`);
}

function legacyJwt() {
  const username  = randomString();
  const data      = {username};
  const token     = jwt.sign(data, 'sonJJxVqRC');
  return {token,data}; // 5ecret
}


describe('jwtAuthMw',()=>{
  const app       = require('express')();
  const jwtmw     = require('./jwtAuthMw');
  const request   = supertest(app);
  const url       = '/testjwt';

  app.use(require('body-parser').json());
  app.get(url, jwtmw);
  app.use((req,res)=>{res.json(req.user)});

  it('401 without jwt', async ()=>{
    await request.get(url).expect(401);
  });

  it('401 with invalid jwt', async ()=>{
    const token = `${randomString()}.${randomString()}.${randomString()}`
    await request.get(url).setJwt(token).expect(401);
  });

  it('authenticates legacy jwt', async ()=>{
    const {token} = legacyJwt();
    await request.get(url).setJwt(token).expect(200);
  });

  it('decodes username correctly ', async ()=>{
    const {token,data}  = legacyJwt();
    const res = await request.get(url).setJwt(token).expect(200);
    expect(res.body.username).toBe(data.username);
  });

});
