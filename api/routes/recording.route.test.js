let request;
const Story = require('../models/story');
const VoiceRecording = require('../models/recording');
const randomString = require('../utils/random').string;

beforeAll(()=>{
  let router = require('./recording.route');
  let app = require('express')()
    .use(router);
  request = require('supertest')(app);
});

function debug(it) {
  if(it === 1) return expect(0).toBe(it);
  expect(1).toBe(it);
}

xdescribe('using gridfs', ()=>{
  jest.setTimeout(200);
  describe('POST /saveAudio/:storyId/:index/:uuid', ()=>{
    const story = new Story();
    const index = '1234';
    const uuid = randomString();
    const url = (storyId,index,uuid)=>`/saveAudio/${storyId}/${index}/${uuid}`;
    const buffer = Buffer.from('hello');
    it('400 invalid file', async ()=>{
      await request.post(url(story._id,index,uuid)).expect(400);
    });
    it('200 good params', async ()=>{
      await request
        .post(url(story._id,index,uuid))
        .attach('audio',buffer,__filename)
        .expect(201);
    });
    it('data matches', async ()=>{
      let res = await request.post(url(story._id,index,uuid))
        .attach('audio',buffer,__filename);
      res = await request.get(`/audio/${res.body.fileId}`)
        .expect('Content-Type','audio/mp3')
        .expect(200);
      expect(res.body.toString()).toBe(buffer.toString());
    });
  });

  describe('POST /updateTracks/:id', ()=>{
    let voice_recording;
    const url=(id)=>`/updateTracks/${id}`;
    beforeAll(async ()=>{
      voice_recording = await VoiceRecording.create({});
    });
    it('creates voice_recording',()=>{        expect(voice_recording).toBeDefined()                     });
    it('400 bad VoiceRecording id',async()=>{ await request.post(url('bad id'))           .expect(400)  });
    it('400 no body',async()=>{               await request.post(url(voice_recording._id)).expect(400)  });
  });
});
