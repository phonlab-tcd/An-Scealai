const mongoose = require('mongoose');
const { upsertGramadoirCacheItem, upsertStoryGramadoirVersion} = require('../../util/grammar');

module.exports = async (req, res, next) => {
  const cache_id =
    (await upsertGramadoirCacheItem(req.body.text, req.body.tagData))
    ._id;
  upsertStoryGramadoirVersion(
    mongoose.mongo.ObjectId(req.body.storyUnderscoreId),
    mongoose.mongo.ObjectId(req.user._id),
    cache_id,
    req.body.timestamp).catch((err) => next(err));
}
