const app       = require('express')()
  .use(require('body-parser').json())
  .use(require('./story.route'));
const supertest = require('supertest');
const request   = supertest(app);
const mongoose  = require('mongoose');
const Story     = require('../models/story');
const randomString = require('../utils/randomString');
const User = require('../models/user');

describe('story routes', () => {
  describe('PATCH /title/:id/:title', () => {
    const username = randomString();
    let token;
    let user
    beforeAll(async()=>{
      user = await User.create({username});
      token = 'Bearer ' + user.generateJwt();
    });
    const url = (id,title) => `/title/${id}/${title}`;
    const req = (url) => request.patch(url);
    function bearer(request){request.set('Authorization', token)}
    it('400 with bad story id', async () => {
      const id = 1234;
      const title = randomString();
      await req(url(id,title)).use(bearer).expect(400);
    });
    it('401 (unauthorized) without jwt', async () => {
      const id = 1234;
      const title = randomString();
      await req(url(id,title)).expect(401);
    });
    it('401 with bad token', async () => {
      const id = 1234;
      const title = randomString();
      await req(url(id,title))
        .set('Authorization','Bearer bad')
        .expect(401);
    });
    it('404 story doesn\'t exist', async ()=> {
      const id = mongoose.Types.ObjectId();
      console.log(id);
      const title = randomString();
      await req(url(id,title)).use(bearer).expect(404);
    });
    it('200 real story id, real jwt', async ()=> {
      const story = await Story.create({studentId: user._id});
      const title = randomString();
      await req(url(story._id, title)).use(bearer).expect(200);
    });
    it('200 story title is updated', async ()=> {
      let story = await Story.create({studentId: user._id});
      const title = randomString();
      await req(url(story._id, title)).use(bearer).expect(200);
      story = await Story.findById(story._id);
      expect(story.title).toBe(title);
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
        text: 'Story is ainm dom.'};
      const res = await request.post(`/create`)
        .send(story).expect(200);
      const foundStory = await Story.findOne({author});
      expect(foundStory.title).toBe(story.title);
      expect(foundStory.text).toBe(story.text);
    });
  });

  describe('/viewFeedback/:id', () => {
    it('sets the \'seenByStudent\' property for the ' +
      'story with given id to true',
    async () => {
      const story = await Story.create({
        feedback: {
          seenByStudent: false,
        },
      });

      await request.post(`/viewFeedback/${story._id}`);

      const updatedStory = await Story.findById(story._id);

      expect(updatedStory.feedback.seenByStudent);
    });

    it('status is 400 for an invalid id: 1234', async () => {
      await request.post('/viewFeedback/1234')
          .expect(400);
    });
  });

  describe('/feedbackAudio/:id', () => {
    it('requires a valid id param', async () => {
      return request
          .get('/feedbackAudio/badId')
          .expect(400)
          .then((response) => {
            expect(response.body.invalidObjectId).toBe('badId');
          });
    });
  });
});
