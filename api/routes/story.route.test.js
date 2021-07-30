const app = require("../server");
const supertest = require("supertest");
const request = supertest(app);
const {removeAllCollections} = require('../utils/test-utils');
const mongoose = require('mongoose');
const Story = require('../models/story');
afterEach(async () => {
  await removeAllCollections();
});

describe("story routes", () => {
  describe("story/getStoryById/:id", () => {
    it("returns a story that exists given its id", async () => {
      const story = await Story.create({title: 'Hello world!', text: 'Story is ainm dom.'});

      const res = await request.get(`/story/getStoryById/${story._id}`);

      expect(res.status).toBe(200);
      expect(res.body.title).toBe(story.title);
      expect(res.body.text).toBe(story.text);
    });

    it("returns a 404 if given an id for a story that does not exist", async () => {
      const nonExistantStoryId = mongoose.Types.ObjectId();

      const res = await request.get(`/story/getStoryById/${nonExistantStoryId}`);

      expect(res.status).toBe(404);
      expect(res.body).toBe(`Story with id ${nonExistantStoryId} not found`);
    });
  });

  describe("story/create", () => {
    it("saves the story in the request body to the DB", async () => {
      const story = {author: 'student-of-the-gaeilge', title: 'Hello world!', text: 'Story is ainm dom.'};

      const res = await request.post(`/story/create`).send(story);

      expect(res.status).toBe(200);
      const foundStory = await Story.findOne({author: story.author});
      expect(foundStory.title).toBe(story.title);
      expect(foundStory.text).toBe(story.text);
    });
  });
});
