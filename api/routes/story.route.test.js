const { ObjectId } = require("bson");
const user = {
  username: "fake user",
  _id: ObjectId(),
};
const app = require("express")()
  .use(require("body-parser").json())
  .use((req, res, next) => {
    const header = req.header('x-authenticated-user');
    if(header) req.user = JSON.parse(header);
    else req.user = user;
    next();
  })
  .use(require("./story.route"));
const supertest = require("supertest");
const request = supertest(app);
const mongoose = require("mongoose");
const Story = require("../models/story");
const Classroom = require('../models/classroom');
const recordingUtil = require('../utils/recordingUtils');

describe("story routes", () => {
  xdescribe("GET /myStudentsStory/:id", ()=>{
    it("200 owner is in teacher's classrom", async ()=>{
      const [studentId,teacherId] = [ObjectId(),user._id];
      const [classroom,story] = await Promise.all([
        Classroom.create({teacherId, studentIds: [studentId]}),
        Story.create({owner: studentId}),
      ]);
      const u = {...user,role: 'TEACHER'};
      const res = await request.get(`/myStudentsStory/${story._id}`)
        .set('x-authenticated-user', JSON.stringify(u))
        .expect(200);
    });
    it("404 owner is not in teacher's classrom", async ()=>{
      const [studentId,teacherId] = [ObjectId(),user._id];
      const [classroom,story] = await Promise.all([
        Classroom.create({teacherId, studentIds: [ObjectId()]}),
        Story.create({owner: studentId}),
      ]);
      const u = {...user,role: 'TEACHER'};
      const res = await request.get(`/myStudentsStory/${story._id}`)
        .set('x-authenticated-user', JSON.stringify(u))
        .expect(404
          );
    });
  });
  describe("GET /story/withId/:id", () => {
    it("200 i am the owner",async ()=>{
      const story = await Story.create({owner: user._id});
      const res = await request.get(`/withId/${story._id}`);//.expect(200);
      console.log('res',res);
    });

    it("404 authenticated user is not the owner", async () => {
      const story = await Story.create({
        owner: ObjectId(),
        title: "Hello world!",
        text: "Story is ainm dom.",
      });
      const res = await request.get(`/withId/${story._id}`).expect(404);
      console.log(res.body);
    });

    it("404 not in database", async () => {
      const nonExistantStoryId = mongoose.Types.ObjectId();
      await request.get(`/withId/${nonExistantStoryId}`).expect(404);
    });

    it("404 auth user is teacher of owner (that's not what this endpoint is for)", async () => {
      const studentId = ObjectId();
      const [classroom,story] = await Promise.all([
        Classroom.create({teacherId: user._id, studentIds: [studentId]}),
        Story.create({owner: studentId}),
      ]);

      const res = await request.get(`/withId/${story._id}`).expect(404);
    });
  });

  describe("POST /create", () => {
    it('200',async()=>{
      await request.post('/create').send().expect(200)
    });
    it("200 ok", async () => {
      const res = await request.post(`/create`).expect(200);
      const foundStory = await Story.findOne({ _id: res.body.id, owner: user._id });
      expect(foundStory);
    });
  });

  describe("GET /:author DEPRECATED", () => {
    xit("THIS ROUTE IS DEPRECATED", () => {});
    const url = (author) => `/${author}`;
    it("returns stories associated with only the author", async () => {
      const AUTHOR_USERNAME = "alice";
      await Story.create([
        {
          owner: ObjectId(),
          title: "Scéal 1",
          text: "Story 1 is ainm dom.",
          author: AUTHOR_USERNAME,
        },
        {
          owner: ObjectId(),
          title: "Scéal 2",
          text: "Story eile atá ann.",
          author: AUTHOR_USERNAME,
        },
        {
          owner: ObjectId(),
          title: "Scéal 3",
          text: "Bob wrote this one!",
          author: "bob",
        },
      ]);
      const res = await request.get(url(AUTHOR_USERNAME)).expect(200);
      expect(res.body.length).toBe(2);
      // 2 alice stories, not bob's story
      for (const story of res.body) {
        expect(story.author).toBe(AUTHOR_USERNAME);
      }
    });
  });

  describe("POST /viewFeedback/:id", () => {
    const url = (id) => `/viewFeedback/${id}`;
    it("sets the 'seenByStudent' property for the story with given id to true", async () => {
      const seenByStudent = false;
      const story = await Story.create({
        owner: ObjectId(),
        feedback: { seenByStudent },
      });
      await request.post(url(story._id));
      const updatedStory = await Story.findById(story._id);
      expect(updatedStory).toBeDefined();
      expect(updatedStory.feedback.seenByStudent);
    });
    it("400 bad ObjectId", async () =>
      await request.post(url("1234")).expect(400));
  });

  describe("GET /feedbackAudio/:id", () => {
    const url = (id) => `/feedbackAudio/${id}`;
    it("requires a valid id param", async () =>
      await request.get(url("badId")).expect(400));
  });

  describe('POST /updateActiveRecording/:id',()=>{
    const url=(storyId)=>`/updateActiveRecording/${storyId}`;
    let activeRecording;
    let storyId;
    beforeAll(async ()=> {
      const res = await Promise.all([
        recordingUtil.upload(Buffer.from('hello'),'filename'),
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
});
