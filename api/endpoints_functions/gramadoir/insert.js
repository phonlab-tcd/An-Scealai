const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const model = mongoose.model("storyGrammarErrors", new mongoose.Schema({owner: ObjectId, storyId: ObjectId, sentences: Array}))

module.exports = async (req, res, next) => {
  const sentences = req.body.sentences;
  
  const storyId = mongoose.mongo.ObjectId(req.body.storyId);
  const userId = mongoose.mongo.ObjectId(req.user._id);

  
  await model.create({owner: userId, storyId: storyId, sentences: sentences} )
  
  res.json()

  
}
