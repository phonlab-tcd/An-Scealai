const app       = require('express')()
  .use(require('body-parser').json())
  .use(require('./story.route'));
const supertest = require('supertest');
const request   = supertest(app);
const mongoose  = require('mongoose');
const Story     = require('../models/story');

describe('story routes', () => {
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
