const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const DescribeGame = require('./describe-game');
const randomImagePath = require('../../utils/randomImagePath');
const _ = require('lodash');
const Promise = require('promise');

const randomRedHerrings = (correct, n) => {
  const uniques = _.uniq([correct, ...randomImagePath(n+1)] );
  const withoutCorrect = _.slice(uniques, 1);
  return _.take(withoutCorrect, n);
};

const collection = 'description.game.interpret.game';
const InterpretGame = new Schema({
  describer: {type: ObjectId, ref: 'User' },
  correct_description: { type: ObjectId, ref: 'DescribeGame' },
  red_herrings: [String],
  estimated_difficulty: Number,
}, {
  collection: collection
});

InterpretGame.statics.createValid = async function (user) {
  const descriptionGame = await (async () => {
    const alreadyUsed = (await this.find()).map(a=>a.correct_description);
    const compareId = user ? user._id : null;
    const potentialDescriptions = await DescribeGame.find({
      'time.finished': { $ne: null },
      ownerId: { $ne: compareId },
      _id: { $nin: alreadyUsed },
    }).sort({_id: 1});
    if(!potentialDescriptions || potentialDescriptions.length === 0)
      throw new Error('no potentialDescriptions to choose from');
    return _.sample(potentialDescriptions); 
  })();
  const red_herrings = randomRedHerrings(descriptionGame.imagePath, 5);
  return await this.create({
    correct_description: descriptionGame._id,
    red_herrings: red_herrings,
  });
};

const InterpretGameSession = new Schema({
  owner: { type: ObjectId, ref: 'User' },
  game: { type: ObjectId, ref: 'InterpretGame' }, // REFERENCES InterpretGame
  time: {
    start: Date,
    finished: Date,
  }
}, {
  collection: collection + '.session',
});

module.exports = {}
module.exports.InterpretGame = mongoose.model('InterpretGame', InterpretGame);

InterpretGameSession.statics.newSession = async function (user) {
  const usingInterpretGame = await (async () => {
    const ig = module.exports.InterpretGame;
    const alreadyUsed =
      (await this.find({owner: user._id}))
      .map(igs=>igs.game);
    const unplayedGames = await ig.find({
      _id: { $nin: alreadyUsed },
      describer: {$ne: user._id},
    });
    const game = _.sample(unplayedGames);
    if(game) return game;
    return ig.createValid(user);
  })();
  const newSession = await this.create({
      owner: user._id,
      game: usingInterpretGame._id,
      time: {start: Date()},
    });
  const correctDescription = await DescribeGame.findById(usingInterpretGame.correct_description);
  newSession.game = usingInterpretGame;
  newSession.game.correct_description_doc = correctDescription;
  return newSession;
};

module.exports.InterpretGameSession = mongoose.model('InterpretGameSession', InterpretGameSession);
