const mockingoose = require('mockingoose');
const getStoryById = require('./getStoryById');
const Story = require('../../models/story.cjs');
const {API404Error} = require('../../utils/APIError.cjs');
const {makeFakeRes, json} = require('../../utils/makeFakeRes');

describe('getStoryById endpoint function', () => {
  it('should throw an API404Error if no story with :id exists', async () => {
    const mockReq = {
      params: {
        id: '111111111111111111111111'
      }
    };
    const mockRes = makeFakeRes();

    await expect(getStoryById(mockReq, mockRes)).rejects.toThrow(API404Error);
  });


  it('should return the Story identified by :id if it exists', async () => {
    const fakeStory = makeFakeStory();
    mockingoose(Story).toReturn(fakeStory, 'findOne');
    const mockReq = {
      params: {
        id: fakeStory._id
      }
    };
    const mockRes = makeFakeRes();

    const response = await getStoryById(mockReq, mockRes);

    expect(response.statusCode).toBe(200);
    expect(json(response.jsonBody)).toMatchObject(fakeStory);
  });
});

const makeFakeStory = () => {
  return {
    _id: '111111111111111111111111',
    title: 'Amazing title!',
    text: 'Hello world :)',
    author: 'some-student-username'
  }
}