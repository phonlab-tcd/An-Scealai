import { ObjectId } from "mongodb";
import searchUser from "./searchUser";
import { it, describe, expect, fit } from "@jest/globals";
import User from "../../models/user";
import random from "../../test-utils/random";
import mongoose from "mongoose";

const user = {
  username: "fake user",
  _id: new ObjectId(),
};

function set_user_with_header(req,res,next) {
  const header = req.header('x-authenticated-user');
  if(header) req.user = JSON.parse(header);
  else req.user = user;
  next();
}

const app = require("express")()
  .set("Accept", "application/json")
  .use(require("body-parser").json())
  .use(set_user_with_header)
  .post("/searchUser", searchUser);

const supertest = require("supertest");
const request = supertest(app);

// Create the model with the schema
function mongoose_any(collection: string) {
  return mongoose.model(collection,  new mongoose.Schema({}, { strict: false }), collection);
}

async function create_student(name) {
  return await User.create({username: name, role: "STUDENT"});
}

async function create_teacher(name) {
  return await User.create({username: name, role: "TEACHER"});
}

describe("/user/searchUser", function(){
  it("sanity check", async function(){
    await request.post("/searchUser");
  });

  it("should error with 404 when no users in db", async function(){
    const r = await request.post("/searchUser").send({searchString: "test", roles: ["STUDENT"]})
    expect(r.status).toBe(404);
  });

  it("should return only students when roles=['STUDENT'] are asked for", async function() {
    const common_string = random.string();
    await Promise.all([
      create_student("alice-" + common_string),
      create_student("bob-" + common_string),
      create_teacher("carl-" + common_string),
    ]);
    const r = await request.post("/searchUser").send({searchString: common_string, roles: ["STUDENT"]});
    expect(r.body.users.length).toBe(2);
  });

  it("should return 400 when roles=[]", async function(){
    const common_string = random.string();
    await Promise.all([
      create_student("alice-" + common_string),
      create_student("bob-" + common_string),
      create_teacher("carl-" + common_string),
    ]);
    const r = await request.post("/searchUser").send({searchString: common_string, roles: []});
    expect(r.status).toBe(400);

  });

  it("should not leak sensitive data", async function() {
    const username = "alice-" +  random.string();
    const user = await mongoose_any(User.collection.name).create({username, verification: {code: "sensitive data"}, more_sensitive_data: "very sensitive"}) as typeof User;

    const r = await request.post("/searchUser").send({searchString: username, roles: ["STUDENT", "TEACHER", "ADMIN"]});


    expect(r.body.verification?.code).not.toBe(user.verification.code);
    expect(r.body.more_sensitive_data).not.toBe(user.more_sensitive_data);

  });

  it("should paginate properly", async function() {
    throw new Error("NYI");
  });
});


// describe('searchUser endpoint function', () => {
//   it('should throw an API404Error if no users match search string', async () => {
//     const mockReq = {
//       params: {
//         searchString: 'test',
//       },
//       body: {},
//     };
//     const mockRes = makeFakeRes();

//     await expect(searchUser(mockReq, mockRes)).rejects.toThrow(API404Error);
//   });

//   it('should return list of users', async () => {
//     const fakeUsers = makeFakeUsers();
//     mockingoose(User).toReturn(fakeUsers, 'find');
//     const mockReq = {
//       params: {},
//       body: {},
//     };
//     const mockRes = makeFakeRes();

//     const response = await searchUser(mockReq, mockRes);

//     expect(response.statusCode).toBe(200);
//     expect(json(response.jsonBody.users)).toMatchObject(fakeUsers);
//   });

//   it('should throw 400 error if currentPage is < 0', async () => {
//     const fakeUsers = makeFakeUsers();
//     mockingoose(User).toReturn(fakeUsers, 'find');
//     const mockReq = {
//       params: {},
//       body: {currentPage: '-1'},
//     };
//     const mockRes = makeFakeRes();

//     await expect(searchUser(mockReq, mockRes)).rejects.toThrow(API400Error);
//   });

//   it('should throw 400 error if limit is < 0', async () => {
//     const fakeUsers = makeFakeUsers();
//     mockingoose(User).toReturn(fakeUsers, 'find');
//     const mockReq = {
//       params: {},
//       body: {limit: '-1'},
//     };
//     const mockRes = makeFakeRes();

//     await expect(searchUser(mockReq, mockRes)).rejects.toThrow(API400Error);
//   });
// });

// const makeFakeUsers = () => {
//   return [
//     {
//       username: 'alice',
//     },
//     {
//       username: 'bob',
//     },
//   ];
// };
