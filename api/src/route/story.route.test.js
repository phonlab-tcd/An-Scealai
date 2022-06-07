const app = require('../server');
const supertest = require('supertest');
const request = supertest.agent(app);
const {removeAllCollections} = require('../util/test-utils');
const mongoose = require('mongoose');
const Story = require('../model/story');

afterEach(async () => {
  await removeAllCollections();
});

describe('story routes', () => {
  describe('story/getStoryById/:id', () => {
    it('returns a story that exists given its id', async () => {
      const story =
        await Story.create({
          title: 'Hello world!',
          text: 'Story is ainm dom.'});

      const res = await request.get(`/story/getStoryById/${story._id}`);

      expect(res.status).toBe(200);
      expect(res.body.title).toBe(story.title);
      expect(res.body.text).toBe(story.text);
    });

    it('returns a 404 if given an id for a story that does not exist',
        async () => {
          const nonExistantStoryId = mongoose.Types.ObjectId();

          const res =
            await request.get(`/story/getStoryById/${nonExistantStoryId}`);

          expect(res.status).toBe(404);
          //expect(res.body)
          //    .toBe(`Story with id ${nonExistantStoryId} not found`);
    });
  });

  describe('story/create', () => {
    it('saves the story in the request body to the DB', async () => {
      const story = {
        author: 'student-of-the-gaeilge',
        title: 'Hello world!',
        text: 'Story is ainm dom.'};

      const res = await request.post(`/story/create`).send(story);

      expect(res.status).toBe(200);
      const foundStory = await Story.findOne({author: story.author});
      expect(foundStory.title).toBe(story.title);
      expect(foundStory.text).toBe(story.text);
    });
  });

  describe('/story/viewFeedback/:id', () => {
    it('sets the \'seenByStudent\' property for the ' +
      'story with given id to true',
    async () => {
      const story = await Story.create({
        feedback: {
          seenByStudent: false,
        },
      });

      await request.post(`/story/viewFeedback/${story._id}`);

      const updatedStory = await Story.findById(story._id);

      expect(updatedStory.feedback.seenByStudent);
    });

    it('status is 400 for an invalid id: 1234', async () => {
      await request.post('/story/viewFeedback/1234')
          .expect(400);
    });
  });

  describe('/story/feedbackAudio/:id', () => {
    it('requires a valid id param', async () => {
      return request
          .get('/story/feedbackAudio/badId')
          .expect(400)
          .then((response) => {
            expect(response.body.invalidObjectId).toBe('badId');
          });
    });
  });
});
