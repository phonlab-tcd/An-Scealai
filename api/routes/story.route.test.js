const app       = require('../server');
const supertest = require('supertest');
const request   = supertest(app);
const mongoose  = require('mongoose');
const Story     = require('../models/story');

describe('story routes', () => {
  describe('GET /story/getStoryById/:id', () => {
    const url = (id)=>`/story/getStoryById/${id}`;
    it('returns a story that exists given its id', async () => {
      const title = 'Hello world!';
      const text  = 'Story is ainm dom.';
      const story = await Story.create({title,text});
      const res = await request
        .get(url(story._id))
        .expect(200);
      expect(res.body.title).toBe(title);
      expect(res.body.text).toBe(text);
    });

    it('returns a 404 if given an id for a story that does not exist', async () => {
      const nonExistantStoryId = mongoose.Types.ObjectId();
      await request
        .get(url(nonExistantStoryId))
        .expect(404);
    });
  });

  describe('/story/create', () => {
    const url = '/story/create';
    it('saves the story in the request body to the DB', async () => {
      const author = 'author';
      const title  = 'title';
      const text   = 'text';
      const story = {author,title,text};
      await request.post(url).send(story).expect(200);
      const foundStory = await Story.findOne({author: story.author});
      expect(foundStory.title).toBe(title);
      expect(foundStory.text).toBe(text);
    });
  });

  describe('/story/viewFeedback/:id', () => {
    const url = id=>`/story/viewFeedback/${id}`;
    it('sets the \'seenByStudent\' property for the story with given id to true', async () => {
      const feedback = { seenByStudent: false };
      const story = await Story.create({feedback});
      await request
        .post(url(story._id))
        .expect(200);
      const updatedStory = await Story.findById(story._id);
      expect(updatedStory.feedback.seenByStudent);
    });

    it('status is 400 for an invalid id: 1234', async () => {
      await request
        .post(url(1234))
        .expect(400);
    });
  });

  describe('/story/feedbackAudio/:id', () => {
    const url = id=>`/story/feedbackAudio/${id}`;
    it('requires a valid id param', async () => {
      const id = 'badId';
      const res = await request
          .get(url(id))
          .expect(400);
      expect(res.body.invalidObjectId).toBe(id);
    });
  });
});
