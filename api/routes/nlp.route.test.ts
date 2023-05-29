import { expect, describe, it } from "@jest/globals";

const { ObjectId } = require("bson");
// const user = {
//   username: "fake user",
//   _id: ObjectId(),
// };
const app = require("express")()
  .use(require("body-parser").json())
  // .use((req, res, next) => {
  //   const header = req.header('x-authenticated-user');
  //   if(header) req.user = JSON.parse(header);
  //   else req.user = user;
  //   next();
  // })
  .use(require("./nlp.route"));

const supertest = require("supertest");
const request = supertest(app);
// const mongoose = require("mongoose");
// const Story = require("../models/story");
// const Classroom = require('../models/classroom');
// const recordingUtil = require('../utils/recordingUtils');

describe("POST /sentenceTokenize", () => {
  it('"Mo madra. Mo madra." => ["Mo madra.", "Mo madra"]',async()=>{
    const res  = await request.post('/sentenceTokenize').send({text: "Mo madra. Mo madra."}).expect(200)
    expect(res.body[0]).toStrictEqual("Mo madra.");
    expect(res.body[1]).toStrictEqual("Mo madra.");
  });
});