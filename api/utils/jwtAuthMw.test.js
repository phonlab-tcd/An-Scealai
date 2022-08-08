const express = require('express');
const supertest = require('supertest');
const cookieParser = require('cookie-parser');
const auth = require('./jwtAuthMw');
const User = require('../models/user');
const { ObjectId } = require('bson');

const app = express()
  .use(cookieParser())
  .use(auth)
  .use((req,res)=>res.json(req.user));
const request = supertest(app);


describe('sanity',()=>{
  test('true',()=>{
    expect(true)
  });
})

describe('verify jwt',()=>{
  test('401 without Authorization header',async ()=>{
    const response = await request.get('/').expect(401);
  })

  test('401 fake jwt',async ()=>await request.get('/').set('cookie', 'token=abcdabcd').expect(401)
  )

  test('200 valid jwt',async ()=>{
    const username = ObjectId().toString();
    const user = await User.create({username})
    const jwt = user.generateJwt();
    const response = await request.get('/')
      .set('Cookie',[`token=${jwt}`])
      .expect(200);
    expect(response.body.username).toEqual(username);
  })
})