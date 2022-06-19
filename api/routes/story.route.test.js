const app         = require('express')()
                    .use(require('body-parser').json())
                    .use(require('./story.route'));
const supertest   = require('supertest');
const request     = supertest(app);
const mongoose    = require('mongoose');
const Story       = require('../models/story');
const {ObjectId}  = mongoose.Types;


describe('story routes', () => {
  describe('POST /update/:id', ()=>{
    const url=id=>`/update/${id}`;
    let story;
    beforeAll(async()=>story=await Story.create({}));
    it('400 bad id',    async()=>await(request.post(url(1234)      ).expect(400)));
    it('404',           async()=>await(request.post(url(ObjectId())).expect(404)));
    it('200 no change', async()=>await(request.post(url(story._id) ).expect(200)));
    it('set text to \'\'',async()=>{
      const res = await request.post(url(story._id)).send({text: ''}).expect(200);
      expect(res.body.text).toEqual('');
    });
    it('don\'t set text to number',async()=>{
      const res = await request.post(url(story._id)).send({text: 1}).expect(200);
      expect(res.body.text).not.toEqual(1);
    });
    it('accept partial update',async()=>{
      await request.post(url(story._id))
        .send({text: 'hello',title: 'hello'})
        .expect(200);
      story = await Story.findById(story._id);
      expect(story.text).toEqual('hello');
      expect(story.title).toEqual('hello');
    });
    it('atomic',async()=>{
      const ress = await Promise.all([
        request.post(url(story._id)).send({text: '0'}).expect(200),
        request.post(url(story._id)).send({text: '1'}).expect(200),
        request.post(url(story._id)).send({text: '2'}).expect(200),
        request.post(url(story._id)).send({text: '3'}).expect(200),
        request.post(url(story._id)).send({text: '4'}).expect(200),
      ]);
      ress.forEach((res,i)=>expect(res.body.text).toEqual(i.toString()));
      const s = await Story.findById(story._id);
      expect(s.text).toMatch(/^[01234]$/)
    });
  });
  describe('story/getStoryById/:id', () => {
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

  describe('/create', () => {
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

  describe('/viewFeedback/:id', () => {
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
