const {
  InterpretGame,
  InterpretGameSession,
} = require('../../../models/description-game/interpret');

const DescribeGame
  = require('../../../models/description-game/describe-game');

module.exports = {};
module.exports.post = async (req,res,next) => {
  const gameSession = await InterpretGameSession
    .findOneAndUpdate(
      {_id: req.body.gameId},
      {'time.finished': Date.now()})
    .populate({
      path: 'game',
      populate: {
        path: 'correct_description',
        model: 'DescribeGame',
      }
    });
  return res.json(gameSession.game.correct_description.imagePath);
}
