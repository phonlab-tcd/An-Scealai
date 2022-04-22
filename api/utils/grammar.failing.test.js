
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

describe('grammar utils KNOW TO FAIL', () => {
  it(
    `should reject non array as grammar tags`,
    async () => {
      const gram = grammarUtils.upsertGramadoirCacheItem('blinks');
      await expect(gram).rejects.toBeDefined();
    });
});
