const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/user');
const Story = require('../models/story');
const gramadoirModels = require('../models/gramadoir');
const {removeAllCollections} = require('../utils/test-utils');
const grammarUtils = require('../utils/grammar');

afterEach(async () => {
  await removeAllCollections();
});

afterAll(async () => {
  mongoose.connection.close();
});

describe('grammar utils', () => {
  describe('upsertGramadoirCacheItem', ()=>{
    it('reject non array', async () => {
      const gram = grammarUtils.upsertGramadoirCacheItem('blinks');
      await expect(gram).rejects.toBeDefined();
    });
    it('resolves', async () => {
      const gram = grammarUtils.upsertGramadoirCacheItem('blinks', []);
      await expect(gram).resolves.toBeDefined();
    });
  });
});

describe('gramadoir mongoose models', () => {
  describe('GramadoirCache', ()=>{
    it('empty array', async () => {
      const input = { text: 'dia dhuit', grammarTags: [] };
      const cacheItem = await gramadoirModels.GramadoirCache.create(input);
    });

    it('QuillHighlightTag form', async () => {
      const cacheItem = await gramadoirModels.GramadoirCache.create({
        text: 'dia dhuit',
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
      expect(cacheItem.text).toBe('dia dhuit');
      expect(cacheItem.grammarTags.length).toBe(1);
      expect(cacheItem.grammarTags[0].start).toBeDefined();
      expect(cacheItem.grammarTags[0].length).toBeDefined();
      expect(cacheItem.grammarTags[0].type).toBeDefined();
      expect(cacheItem.grammarTags[0].messages.ga).toBeDefined();
      expect(cacheItem.grammarTags[0].messages.en).toBeDefined();
    });
  });

  describe('and upsertStoryGramadoirVersion', ()=>{
    it('should throw if userId,storyId,or gramId is invalid', async () => {
      const [user,story,gram] = await Promise.all([
        User.create({username: 'neimhin'}),
        Story.create({}),
        gramadoirModels.GramadoirCache.create({
          text: 't',
          grammarTags: [],
        })
      ]);
      let history = grammarUtils.upsertStoryGramadoirVersion(
        null,
        user._id,
        gram._id,
        new Date());
      await expect(history).rejects.toThrow();
      history = grammarUtils.upsertStoryGramadoirVersion(
        story._id,
        null,
        gram._id,
        new Date()); expect(history).rejects.toBeDefined();
      await expect(history).rejects.toThrow();
      history = grammarUtils.upsertStoryGramadoirVersion(
        story._id,
        user._id,
        null,
        new Date()); expect(history).rejects.toBeDefined();
      await expect(history).rejects.toThrow();
    });

    it('should create a new user and add a grammar error history item for that user', async () => {
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
  });
});
