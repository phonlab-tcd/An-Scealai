const mongoose = require('mongoose');
const { upsertGramadoirCacheItem, upsertStoryGramadoirVersion} = require('../../utils/grammar');

const either = [ok=>({ok}),err=>({err})];

module.exports = async (req, res, next) => {
  const text = req.body.text;
  const tags = req.body.tagData;
  const cacheItem = await upsertGramadoirCacheItem(text,tags)
    .then(...either);
  if(cacheItem.err) return res.status(500).json(cacheItem.err);       	
  
  const storyId = mongoose.mongo.ObjectId(req.body.storyUnderscoreId);
  const userId = mongoose.mongo.ObjectId(req.user._id);
  const cacheId = cacheItem.ok._id;
  const time = req.body.timestamp;
  const upsert = await upsertStoryGramadoirVersion(storyId, userId, cacheId, time)
    .then(...either);
  if(upsert.err) return res.status(500).json(upsert.err);
  return res.json(upsert.ok);
}
