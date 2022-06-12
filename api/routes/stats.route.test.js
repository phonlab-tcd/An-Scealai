let request;

beforeAll(async ()=>{
  const supertest     = require('supertest');
  const router        = require('./stats.route');
  const app           = require('express')().use(router);
  request             = supertest(app);
});

describe('GET profile data date range', ()=>{
  const url = (start,end)=>`/getProfileDataByDate/${start}/${end}`;
  it('GET /getProfileDataByDate/now/now 200', async()=>{
    const now = Date.now();
    const res = await request.get(url(now,now)).expect(200);
    expect(res.body).toEqual([]);
  });

  it('GET /getProfileDataByDate/empty/empty 200', async()=>{
    const username = require('../utils/randomString')();
    const status   = 'Active';
    require('../models/user').create({username,status});
    const x = 'empty';
    const res = await request.get(url(x,x)).expect(200);
    expect(res.body).toEqual([[]]);
  });
});

