const supertest = require('supertest');
const app       = require('../server');
const request   = supertest(app);
const mongoose  = require('mongoose');


describe('/recordings', ()=>{
  it('POST /create then GET /:id', async ()=>{
    const _id = mongoose.Types.ObjectId();
    await request.post('/recordings/create').send({_id}).expect(200);
    await request.get(`/recordings/${_id}`).expect(200);
  });

  it('POST /saveAudio/1234/1234/1234 404',async ()=>{
    const res = await request.post('/saveAudio/1234/1234/1234')
      .expect(404);
  });

  it('POST /saveAudio/realid/1234/1234', async ()=>{
    const {body}  = await request.post('/story/create');
    const res = await request
      .post(`/recordings/saveAudio/${body.id}/1234/1234`)
      .expect(400);
    // message explains that 'file.buffer' property is undefined
    expect(res.message.contains('buffer'));
  });
});
