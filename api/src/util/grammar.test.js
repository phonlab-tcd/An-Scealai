const app = require('../server');
const mongoose = require('mongoose');
const User = require('../model/user');
const Story = require('../model/story');
const gramadoirModels = require('../model/gramadoir');
const {removeAllCollections} = require('../util/test-utils');
const grammarUtils = require('../util/grammar');

function randomString(length=16) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

describe('grammar utils', () => {
  it(
    `upsertGramadoirCacheItem should reject non array`,
    async () => {
      const gram = grammarUtils.upsertGramadoirCacheItem('blinks');
      expect(async ()=>await gram).rejects.toBeDefined();
    });
});

describe('gramadoir log route', () => {
  it(
    `should create cache item with no grammar tags`,
    async () => {
      const text = randomString();
      const grammarTags = [];
      const cacheItem = await gramadoirModels.GramadoirCache
        .create({text,grammarTags});
      expect(async ()=>await gramadoirModels.GramadoirCache.find({text}))
        .toBeDefined();
  });


  it(
    `should create cache item with one
    error in QuillHighlightTag form`,
    async () => {
      const text = randomString();
      const cacheItem = await gramadoirModels.GramadoirCache.create({
        text,
        grammarTags: [{
          start: 0,
          length: 3,
          type: 'CAPITALIZATION',
          messages: {
            ga: 'mór!',
            en: 'big!',
            }
          }],
      });
      expect(cacheItem).toBeDefined();
      expect(cacheItem.text).toBe(text);
      expect(cacheItem.grammarTags.length).toBe(1);
      expect(cacheItem.grammarTags[0].start).toBeDefined();
      expect(cacheItem.grammarTags[0].length).toBeDefined();
      expect(cacheItem.grammarTags[0].type).toBeDefined();
      expect(cacheItem.grammarTags[0].messages.ga).toBeDefined();
      expect(cacheItem.grammarTags[0].messages.en).toBeDefined();
  });

  it(
    `upsertStoryGramadoirVersion should throw if
    userId,storyId,or gramId is invalid`,
    async () => {
      const [user,story,gram] = await Promise.all([
        User.create({username: 'neimhin'}),
        Story.create({}),
        gramadoirModels.GramadoirCache.create({
          text: 't',
          grammarTags: [],
        })
      ]);
      const storyId = story._id;
      const userId = user._id;
      const gramadoirCacheId = gram._id;
      let history = grammarUtils.upsertStoryGramadoirVersion({
        storyId: null,
        userId,
        gramadoirCacheId,
        });
      await expect(history).rejects.toBeDefined();
      history = grammarUtils.upsertStoryGramadoirVersion({
        storyId, 
        userId: null,
        gramadoirCacheId,
        }); expect(history).rejects.toBeDefined();
      await expect(history).rejects.toBeDefined();
      history = grammarUtils.upsertStoryGramadoirVersion({
        storyId,
        userId,
        gramadoirCacheId: null,
        }); expect(history).rejects.toBeDefined();
      await expect(history).rejects.toBeDefined();
    });

  it(
    `should create a new user and add a grammar error
    history item for that user`,
    async () => {
      const [user,story,gram] = await Promise.all([
        User.create({username: randomString}),
        Story.create({}),
        gramadoirModels.GramadoirCache.create({text:randomString(),grammarTags:[]})
      ]);
      const history = grammarUtils.upsertStoryGramadoirVersion({
        storyId:          story._id,
        userId:           user._id,
        gramadoirCacheId: gram._id,
      });
      await expect(history).resolves.not.toThrow();
    });
});
// 
//     it(
//       `should create a new gramadoir cache item`,
//       async () => {
//         const gram = grammarUtils.upsertGramadoirCacheItem('blinks', []);
//         await expect(gram).resolves.toBeDefined();
//       });
// });
