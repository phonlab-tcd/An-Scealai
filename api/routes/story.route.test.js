const { ObjectId } = require('bson');
const user = {
  username: 'fake user',
  _id: ObjectId(),
}
const app       = require('express')()
  .use(require('body-parser').json())
  .use((req,res,next)=>{req.user = user; next()})
  .use(require('./story.route'));
const supertest = require('supertest');
const request   = supertest(app);
const mongoose  = require('mongoose');
const Story     = require('../models/story');

describe('story routes', () => {
  describe('story/getStoryById/:id', () => {
    it('404, i am not the owner', async () => {
      const story = await Story.create({owner: ObjectId(), title: 'Hello world!',text: 'Story is ainm dom.'});
      const res = await request.get(`/getStoryById/${story._id}`).expect(404);
      console.log(res.body);
    });

    it('404 not in database', async () => {
      const nonExistantStoryId = mongoose.Types.ObjectId();
      const res = await request.get(`/getStoryById/${nonExistantStoryId}`);
      console.log(res.body);
      expect(res.status).toBe(404);
    });
  });

  describe('/create', () => {
    it('200 ok', async () => {
      const owner = ObjectId();
      const story = {owner};
      const res = await request.post(`/create`).send(story).expect(200);
      const foundStory = await Story.findOne({owner});
      expect(foundStory.owner.toString()).toBe(owner.toString());
    });
  });

  describe('GET /:author DEPRECATED', () => {
    xit('THIS ROUTE IS DEPRECATED',()=>{})
    const url=(author)=>`/${author}`
    it('returns stories associated with only the author', async () => {
      const AUTHOR_USERNAME = 'alice';
      await Story.create([
        {
          owner: ObjectId(),
          title: 'Scéal 1',
          text: 'Story 1 is ainm dom.',
          author: AUTHOR_USERNAME
        },
        {            
          owner: ObjectId(),
          title: 'Scéal 2',
          text: 'Story eile atá ann.',
          author: AUTHOR_USERNAME
        },
        {            
          owner: ObjectId(),
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
      const story = await Story.create({owner: ObjectId(), feedback:{seenByStudent}});
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
