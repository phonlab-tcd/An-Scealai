const mockingoose       = require('mockingoose');
const express           = require('express');
const searchUser        = require('./searchUser');
// const User              = require('../../model/user');
// const { API404Error }   = require('../../util/APIError');
// const { API400Error }   = require('../../util/APIError');
const { makeFakeRes }   = require('../../util/makeFakeRes');
// const { json }          = require('../../util/makeFakeRes');

describe('sanity check', function sanityCheck() {
  it('always passes', function alwaysPasses() {
    expect(true);
  });
});

describe('searchUser endpoint function', () => {
  it('empty array if no users match', async function api404() {
    const mockReq = {
      params: {
        searchString: 'test'
      },
      body: {}
    };
    searchUser(mockReq, {json: (result)=>{
      expect(result.count).toBe(0);
      expect(result.users).toStrictEqual([]);
    }});
  });

});

//   it('should return list of users', async () => {
//     const app = express.server();
//     const fakeUsers = makeFakeUsers();
//     mockingoose(User).toReturn(fakeUsers, 'find');
//     const mockReq = {
//       params: {},
//       body: {}
//     };
//     const mockRes = makeFakeRes();
// 
//     const response = await searchUser(mockReq, mockRes);
// 
//     expect(response.statusCode).toBe(200);
//     expect(json(response.jsonBody.users)).toMatchObject(fakeUsers);
//   });
// 
//   it('should throw 400 error if currentPage is < 0', async () => {
//     const fakeUsers = makeFakeUsers();
//     mockingoose(User).toReturn(fakeUsers, 'find');
//     const mockReq = {
//       params: {},
//       body: {currentPage: '-1'}
//     };
//     const mockRes = makeFakeRes();
// 
//     await expect(searchUser(mockReq, mockRes)).rejects.toThrow(API400Error);
//   });
// 
//   it('should throw 400 error if limit is < 0', async () => {
//     const fakeUsers = makeFakeUsers();
//     mockingoose(User).toReturn(fakeUsers, 'find');
//     const mockReq = {
//       params: {},
//       body: {limit: '-1'}
//     };
//     const mockRes = makeFakeRes();
// 
//     await expect(searchUser(mockReq, mockRes)).rejects.toThrow(API400Error);
//   });
// });
// 
const makeFakeUsers = () => {
  return [
      {
        username: 'alice'
      },
      {
        username: 'bob'
      }
  ];
}
