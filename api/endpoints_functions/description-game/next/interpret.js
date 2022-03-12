const path = require('path');
const rootDir = require('../../../utils/rootDir');
const DescribeGame = require(rootDir+
  '/models/description-game/describe-game');
const InterpretGame = require(rootDir+
  '/models/description-game/interpret').InterpretGame;
const InterpretGameSession =require(rootDir+
  '/models/description-game/interpret').InterpretGameSession;

module.exports = {};
module.exports.get = async (req,res,next) => {
  const openSession = await InterpretGameSession.findOne({
    ownerId: req.user._id,
    'time.finished': null,
  });
  if(openSession)
    return res.json(openSession);
  const newSession = await InterpretGameSession.newSession();
  res.json(newSession);
};
