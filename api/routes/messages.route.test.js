const spinup    = require('supertest');
const app       = require('../server');
const mongoose  = require('mongoose');
const request   = spinup(app);

describe('POST /addMessageAudio/:id', ()=>{
  it('works', async ()=>{
    const _id = mongoose.Types.ObjectId();
    let url = '/messages/create';
    await request.post(url).send({_id}).expect(200);
    url = `/messages/addMessageAudio/${_id}`;
    await request.post(url).expect(400); // no buffer
  });
});
