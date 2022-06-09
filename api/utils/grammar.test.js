const request         = require('supertest')(require('../server'));
const User            = require('../models/user');
const Story           = require('../models/story');
const gramadoirModels = require('../models/gramadoir');
const grammarUtils    = require('../utils/grammar');
const randomString    = require('../utils/randomString');

describe('grammar utils', () => {
  it(
    `upsertGramadoirCacheItem should reject non array`,
    async () => {
      const gram = grammarUtils.upsertGramadoirCacheItem('blinks');
      await expect(gram).rejects.toThrow(Error);
    });
});

describe('gramadoir log route', () => {
  it('should create cache item with no grammar tags', async () => {
    const text = 'dia dhuit';
    const grammarTags = [];
    const cacheItem = await gramadoirModels.GramadoirCache.create({text,grammarTags});
  });

  it('should create cache item with', async () => {
    const type      = 'some type';
    const start     = 0;
    const length    = 1;
    const messages  = {ga:' ',en:' '};
    const tag       = {start,length,type,messages};
    const text      = randomString();
    const grammarTags = [tag];
    const cacheItem = await gramadoirModels.GramadoirCache.create({text,grammarTags});
    expect(cacheItem.grammarTags[0].type).toBe(type);
  });

  it('upsertStoryGramadoirVersion should throw if userId is invalid', async () => {
    const g = gramadoirModels.GramadoirCache;
    const promises = [Story.create({}),g.create({})];
    const [story,gram] = await Promise.all(promises);
    let history = grammarUtils.upsertStoryGramadoirVersion(story._id,null,gram._id,new Date());
    await expect(history).rejects.toThrow(Error);
  });

  it(
    `should create a new user and add a grammar error
    history item for that user`,
    async () => {
      const [user,story,gram] = await Promise.all([
        User.create({username: 'neimhin'}),
        Story.create({}),
        gramadoirModels.GramadoirCache.create({
          text: 't',
          grammarTags: [],
        })
      ]);
      const history = grammarUtils.upsertStoryGramadoirVersion(
        story._id,
        user._id,
        gram._id,
        new Date());
      await expect(history).resolves.not.toThrow();
    });

    it(
      `should create a new gramadoir cache item`,
      async () => {
        const gram = grammarUtils.upsertGramadoirCacheItem('blinks', []);
        await expect(gram).resolves.toBeDefined();
      });
});
