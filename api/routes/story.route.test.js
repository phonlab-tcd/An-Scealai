const app           = require('express')()
  .use(require('body-parser').json())
  .use(require('./story.route'));
const supertest             = require('supertest');
const request               = supertest(app);
const mongoose              = require('mongoose');
const { ObjectId }          = mongoose.Types;
const Story                 = require('../models/story');
const voiceRecording        = require('../utils/voiceRecording');

describe('story routes', () => {
  describe('POST /updateActiveRecording/:id',()=>{
    const url=(storyId)=>`/updateActiveRecording/${storyId}`;
    let activeRecording;
    let storyId;
    beforeAll(async ()=> {
      const res = await Promise.all([
        voiceRecording.upload(Buffer.from('hello'),'filename'),
        Story.create({}),
      ]);
      activeRecording=res[0];
      storyId=res[1]._id;
    });
    it('bug regression test, double send \'Story not found\'',async()=>{
      await request.post(url('1234'));
      //make sure server is still running
      await request.post('/create').send({}).expect(200);
    });
    it('400 bad story id',            async()=>await request.post(url('1234')    ).send({activeRecording}            ).expect(400));
    it('404 fake story id',           async()=>await request.post(url(ObjectId())).send({activeRecording}            ).expect(404));
    it('400 bad activeRecording id',  async()=>await request.post(url(storyId)   ).send({activeRecording: '1234'}    ).expect(400));
    it('404 fake activeRecording id', async()=>await request.post(url(storyId)   ).send({activeRecording: ObjectId()}).expect(404));
    it('200',                         async()=>await request.post(url(storyId)   ).send({activeRecording}            ).expect(200));
  });

  describe('GET /story/getStoryById/:id', () => {
    it('returns a story that exists given its id', async () => {
      const story =
        await Story.create({
          title: 'Hello world!',
          text: 'Story is ainm dom.'});

      const res = await request.get(`/getStoryById/${story._id}`);

      expect(res.status).toBe(200);
      expect(res.body.title).toBe(story.title);
      expect(res.body.text).toBe(story.text);
    });

    it('returns a 404 if given an id for a story that does not exist',
        async () => {
          const nonExistantStoryId = mongoose.Types.ObjectId();

          const res =
            await request.get(`/getStoryById/${nonExistantStoryId}`);

          expect(res.status).toBe(404);
          //expect(res.body)
          //    .toBe(`Story with id ${nonExistantStoryId} not found`);
    });
  });

  describe('POST /create', () => {
    it('saves the story in the request body to the DB', async () => {
      const author = Math.random().toString(20);
      const story = {
        author,
        title: 'Hello world!',
        text: 'Story is ainm dom.'
      };

      const res = await request.post(`/create`).send(story);

      expect(res.status).toBe(200);
      const foundStory = await Story.findOne({author: story.author});
      expect(foundStory.title).toBe(story.title);
      expect(foundStory.text).toBe(story.text);
    });
  });

  describe('GET /:author', () => {
    const url=(author)=>`/${author}`
    it('returns stories associated with only the author', async () => {
      const AUTHOR_USERNAME = 'alice';
      await Story.create([
        {
          title: 'Scéal 1',
          text: 'Story 1 is ainm dom.',
          author: AUTHOR_USERNAME
        },
        {            
          title: 'Scéal 2',
          text: 'Story eile atá ann.',
          author: AUTHOR_USERNAME
        },
        {            
          title: 'Scéal 3',
          text: 'Bob wrote this one!',
          author: 'bob'
        },
      ]);
      const res = await request.get(url(AUTHOR_USERNAME)).expect(200);
      expect(res.body.length).toBe(2);
      // 2 alice stories, not bob's story
      for(const story of res.body){
        expect(story.author).toBe(AUTHOR_USERNAME);
      }
    });
  });

  describe('POST /viewFeedback/:id', () => {
    const url=(id)=>`/viewFeedback/${id}`;
    it("sets the 'seenByStudent' property for the story with given id to true",async()=>{
      const seenByStudent = false;
      const story = await Story.create({feedback:{seenByStudent}});
      await request.post(url(story._id));
      const updatedStory = await Story.findById(story._id);
      expect(updatedStory).toBeDefined();
      expect(updatedStory.feedback.seenByStudent);
    });
    it('400 bad ObjectId',async()=>await request.post(url('1234')).expect(400));
  });

  describe('GET /feedbackAudio/:id', () => {
    const url=(id)=>`/feedbackAudio/${id}`;
    it('requires a valid id param',async()=>await request.get(url('badId')).expect(400));
  });
});
