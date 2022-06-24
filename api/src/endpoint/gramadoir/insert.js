const mongoose = require('mongoose');
const { upsertGramadoirCacheItem, upsertStoryGramadoirVersion} = require('../../util/grammar');

const either = promise=>promise.then(ok=>({ok}),err=>({err}));

module.exports = async (req, res, next) => {
  const gram = await either(upsertGramadoirCacheItem(req.body.text, req.body.tagData));
  console.log(gram);
  if('err' in gram) return res.status(400).json(gram.err);
  const cache_id = gram.ok._id;
  const storyId = new mongoose.mongo.ObjectId(req.body.storyId);
  const userId = req.user._id;
  const upsertPromise = upsertStoryGramadoirVersion({
    storyId: storyId,
    userId: userId,
    gramadoirCacheId: cache_id,
    timestamp: req.body.timestamp,
  })
  const upsert = await either(upsertPromise);
  console.log(upsert);
  if('err' in upsert) return res.status(400).json(upsert.err);
  console.log(upsert.ok);
  res.json({gram,upsert: upsert.ok})
}
