const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const DescribeGame = require('./describe-game');

const collection = 'description.game.interpret.game';
const InterpretGame = new Schema({
  correct_description: ObjectId,
  red_herrings: [String],
  estimated_difficulty: Number,
}, {
  collection: collection
});

InterpretGame.statics.createValid = async () => {
  const docs = await DescribeGame.find({
    'time.finished': { $ne: null },
  }).sort({_id: 1});
  console.log(docs);
};

const InterpretGameSession = new Schema({
  ownerId: ObjectId,
  gameId: ObjectId,
  time: {
    start: Date,
    finished: Date,
  }
}, {
  collection: collection + '.session',
});

InterpretGameSession.statics.newSession = async () => {
  const finishedGames =
    await DescribeGame.find(
      {'time.finished': { $ne: null }});
  console.log(finishedGames);
  return 'bloop';
};

module.exports = {}
module.exports.InterpretGame = mongoose.model('InterpretGame', InterpretGame);
module.exports.InterpretGameSession = mongoose.model('InterpretGameSession', InterpretGameSession);
