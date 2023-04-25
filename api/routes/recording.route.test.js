let request;
const Story = require('../models/story');
const VoiceRecording = require('../models/recording');
const randomString = require('../utils/random').string;

beforeAll(()=>{
  let router = require('./recording.route');
  let app = require('express')()
    .use(require('body-parser').json())
    .use(router);
  request = require('supertest')(app);
});

function debug(it) {
  if(it === 1) return expect(0).toBe(it);
  expect(1).toBe(it);
}

fdescribe('using gridfs', ()=>{
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
    const dummyBody=(d=1)=>{
      const paragraphAudioIds = [d];
      const paragraphIndices  = [d];
      const sentenceAudioIds  = [d];
      const sentenceIndices   = [d];
      return {paragraphAudioIds,paragraphIndices,sentenceAudioIds,sentenceIndices}; 
    }
    it('creates voice_recording',()=>expect(voice_recording).toBeDefined());
    it('400 bad VoiceRecording id',async()=>await request.post(url('bad id')).expect(400));
    it('200 good params',async()=>await request.post(url(voice_recording._id)).send(dummyBody()));
    it('200 data matches',async()=>{
      const body = dummyBody();
      await request.post(url(voice_recording._id)).send(body);
      const savedRecording = await VoiceRecording.findById(voice_recording._id);
      for(const k of Object.keys(body)){
        expect(savedRecording[k].toObject().map(Number))
          .toEqual(body[k]);
      }
    });
    it('200 idempotent',async()=>{
      const body = dummyBody();
      await request.post(url(voice_recording._id)).send(dummyBody(2)).expect(200);
      await request.post(url(voice_recording._id)).send(body).expect(200);
      const savedRecording = await VoiceRecording.findById(voice_recording._id);
      for(const k of Object.keys(body)){
        expect(savedRecording[k].toObject().map(Number))
          .toEqual(body[k]);
      }
    });
    it('200 handle race',async()=>{
      const body = dummyBody();
      await Promise.all([
        request.post(url(voice_recording._id)).send(body).expect(200),
        request.post(url(voice_recording._id)).send(body).expect(200),
      ]);
      const savedRecording = await VoiceRecording.findById(voice_recording._id);
      for(const k of Object.keys(body)){
        expect(savedRecording[k].toObject().map(Number))
          .toEqual(body[k]);
      }
    });
  });
});