const { ObjectId } = require("bson");
const { patch } = require("./google-analytics");
const request = require("supertest")(
  require("express")()
    .use(require("body-parser").json())
    .use((req,res,next)=>{req.user = user; next()}) //fudge authentication
    .patch("/google-analytics",patch)
);
const user = { _id: ObjectId(), username: "whatever" };

beforeAll(async ()=>{
  return console.log(await require("../../models/user").create(user))
});

describe("/privacy-preferences",()=>{
  describe("/google-analytics",()=>{
    const sendBody = (body) => request.patch("/google-analytics").send(body);
    it("200", async()=>                         await sendBody({prompt: "v0",      accept: true}).expect(200));
    it("400 invalid prompt field", async()=>    await sendBody({prompt: "i dunno", accept: true}).expect(400));
    it("400 invalid accepted field", async()=>  await sendBody({prompt: "i dunno", accept: "ok"}).expect(400));
  });
})
