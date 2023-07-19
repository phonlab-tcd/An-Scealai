import { ObjectId } from "mongodb";
import searchUser from "./searchUser";
import { it, describe, expect } from "@jest/globals";

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
  .use(require("body-parser").json())
  .use(set_user_with_header)
  .post("/searchUser", searchUser);

const supertest = require("supertest");
const request = supertest(app);


describe("/user/searchUser", function(){
  it("sanity check", async function(){
    await request.post("/searchUser");
  });

  it("should error with 404 when no users in db", async function(){
    const r = await request.post("/searchUser", {searchString: "test"});
    expect(r.status).toBe(404);
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
