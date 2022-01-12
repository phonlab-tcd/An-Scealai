const mockingoose = require('mockingoose');
const searchUser = require('./searchUser');
const User = require('../../models/user');
const {API404Error, API400Error} = require('../../utils/APIError');
const {makeFakeRes, json} = require('../../utils/makeFakeRes');


describe('searchUser endpoint function', () => {
  it('should throw an API404Error if no users match search string', async () => {
    const mockReq = {
      params: {
        searchString: 'test'
      },
      body: {}
    };
    const mockRes = makeFakeRes();

    await expect(searchUser(mockReq, mockRes)).rejects.toThrow(API404Error);
  });

  it('should return list of users', async () => {
    const fakeUsers = makeFakeUsers();
    mockingoose(User).toReturn(fakeUsers, 'find');
    const mockReq = {
      params: {},
      body: {}
    };
    const mockRes = makeFakeRes();

    const response = await searchUser(mockReq, mockRes);

    expect(response.statusCode).toBe(200);
    expect(json(response.jsonBody.users)).toMatchObject(fakeUsers);
  });

  it('should throw 400 error if currentPage is < 0', async () => {
    const fakeUsers = makeFakeUsers();
    mockingoose(User).toReturn(fakeUsers, 'find');
    const mockReq = {
      params: {},
      body: {currentPage: '-1'}
    };
    const mockRes = makeFakeRes();

    await expect(searchUser(mockReq, mockRes)).rejects.toThrow(API400Error);
  });

  it('should throw 400 error if limit is < 0', async () => {
    const fakeUsers = makeFakeUsers();
    mockingoose(User).toReturn(fakeUsers, 'find');
    const mockReq = {
      params: {},
      body: {limit: '-1'}
    };
    const mockRes = makeFakeRes();

    await expect(searchUser(mockReq, mockRes)).rejects.toThrow(API400Error);
  });
});

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