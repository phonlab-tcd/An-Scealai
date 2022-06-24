const router =  require('./gramadoir.route');
const {jwtmw} = require('../util/authMiddleware');
const app =     require('express')()
                  .use(require('body-parser').json())
                  .use(jwtmw)
                  .use(router);
const request = require('supertest')(app);
const randomString = require('../util/randomString');
const User = require('../model/user');
const Story = require('../model/story');
const {ObjectId} = require('mongoose').Types;


let user: any;
let token: string;
let story: any;
beforeAll(async()=>{
  const username = randomString();
  user = await User.create({username});
  token = await user.generateJwt();
  await user.save();
  story = await Story.create({text: 'hello bello'});
  console.log('storyId',story._id);
});

describe('/gramadoir',()=>{
  describe('POST /insert', ()=>{
    const req = ()=>request.post('/insert').set('Authorization', 'Bearer ' + token);
    it('401 no jwt',async()=>await request.post('/insert').expect(401));
    it('400 no params',async()=>await req().expect(400));
    it('400 bad storyId',async()=>await req().send({
      storyId: ObjectId(),
      text: randomString(),
      tagData: [],
    }).expect(400));
    it('200',async()=>{
      console.log('storyId',story._id.toString());
      await req().send({
      storyId: story._id,
      text: randomString(),
      tagData: [],
    }).expect(200)});
  });
});
