const mongoose = require('mongoose');
module.exports = async (req, res) => {
  console.dir(req.pabody.tagData);
  const cache_id =
    (await upsertGramadoirCacheItem(req.body.text, req.body.tagData))
    ._id;
  upsertStoryGramadoirVersion(
    mongoose.mongo.ObjectId(req.body.storyUnderscoreId),
    mongoose.mongo.ObjectId(req.body.userUnderscoreId),
    cache_id,
    req.body.timestamp).catch((err) => {throw err});

}
