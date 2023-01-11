const PrivacyPreferences = require("./privacy-preferences");
const { ObjectId } = require("bson");


describe("PrivacyPreferences model",()=>{
  it("can create", async()=>await PrivacyPreferences.create());

  describe("Google Analytics", ()=>{
    it("valid event type", async()=>
      (await PrivacyPreferences.create({engagement:{acceptedEventTypes: ["CREATE-STORY"]}}))
        .validate() );

    it("fails validation with wrong string", async()=>
      expect(PrivacyPreferences.create({engagement:{acceptedEventTypes:["wrong"]}))
        .rejects.toThrow());
  });

  describe("Engagement", ()=>{
    it("valid prompt type for Google Analytics",async()=>
      await PrivacyPreferences.create({googleAnalytics: {prompt: "v0"}}));

    it("invalid prompt type for Google Analytics",async()=>
      expect(PrivacyPreferences.create({googleAnalytics: {prompt: "wrong"}))
        .rejects.toThrow());
  });
});
