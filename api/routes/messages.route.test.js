const app = require('express')()
    .use(require('body-parser').json())
    .use(require('./messages.route'));
const supertest = require('supertest');
const request = supertest(app);
const mongoose = require('mongoose');
const Message = require('../models/message');
const {ObjectId} = require('bson');

describe('messages routes', () => {
  it('/viewMessges/:id', async ()=>{
    const _id = ObjectId();
    await request.post('/create').send({_id}).expect(200);
    const res = await request.get(`/viewMessges/${_id}`).expect(200);
    expect(res.body.id === 0);
  });

  it('/messageAudio/:id', async ()=>{
    const message = await Message.create({});
    const buffer = Buffer.from('abc');
    await request.post(`/addMessageAudio/${message._id}`).attach('audio', buffer, 'fakeFileName');
    const res = await request.get(`/messageAudio/${message._id}`).expect(200);
    expect(res.body.toString()).toEqual(buffer.toString());
  });

  it('/addMessageAudio/:id', async ()=>{
    const _id = ObjectId();
    const m = await request.post('/create').send({_id}).expect(200);
    await request
        .post(`/addMessageAudio/${m.body._id}`)
        .attach('audio', Buffer.from('hello'), 'fakeFileName')
        .expect(201);
  });
});
