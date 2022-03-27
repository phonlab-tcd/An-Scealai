const path = require('path');
const _ = require('lodash');
const rootDir = require('../../../utils/rootDir');
const DescribeGame = require(rootDir+
  '/models/description-game/describe-game');
const InterpretGame = require(rootDir+
  '/models/description-game/interpret').InterpretGame;
const InterpretGameSession =require(rootDir+
  '/models/description-game/interpret').InterpretGameSession;

module.exports = {};
module.exports.get = async (req,res,next) => {
  const openSessions = (await InterpretGameSession.find({
    owner: req.user._id,
    'time.finished': null,
  }));
  console.log(openSessions);
  const openSession = _.sample(openSessions);
  if(openSession) {
    openSession.game =
      await InterpretGame.findById(openSession.game);
    openSession.game.correct_description =
      await DescribeGame.findById(openSession.game.correct_description);
    openSession.shuffledImages =
      _.shuffle(
        openSession.game.red_herrings.concat(
          [openSession.game.correct_description.imagePath]));
    console.log(openSession.shuffledImages);
    console.log('OPEN SESSION');
    console.log(openSession);
    return res.json(openSession);
  }
  try {
    console.log('NEW SESSION');
    const newSession = await InterpretGameSession.newSession(req.user);
    await newSession.game.populate('correct_description');
    console.log(newSession);
    return res.json(newSession);
  } catch (e) {
    return next(e)
  }

};
