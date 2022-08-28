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
  .get('/mine',require("./mine"));
const supertest = require("supertest");
const request = supertest(app);
const mongoose = require("mongoose");
const Story = require("../../models/story");

const expectEmptyArray = function(a) {
  expect(a instanceof Array);
  expect(a.length === 0);
}
const expectSameId = function(...args) {
  const first = args[0].toString();
  args.slice(1)
    .map(id=>id.toString())
    .forEach(id=>expect(id).toEqual(first));
}

describe("GET /story/mine", ()=> {
  const get = ()=>request.get('/mine');
  it("200 empty array, brand new user", async()=>{
    const r = await get().expect(200);
    expectEmptyArray(r.body);
  });

  it("200 only gives me my stories",async()=>{
    const owner = ObjectId();
    const [mine] = await Story.create([{owner: user._id},{owner},{owner}]);
    const { body } = await get().expect(200);
    expect(body.length).toBe(1);
    expectSameId(mine._id, body[0]._id);
  });
});
