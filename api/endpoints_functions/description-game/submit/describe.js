const DescribeGame = require('../../../models/description-game/describe-game');

module.exports = {};
module.exports.post = async (req, res, next) => {
  if (!(req.user._id.toString() === req.body.game.ownerId))
    return res.sendStatus(401);
  const game = await DescribeGame.findOneAndUpdate(
    {_id: req.body.game._id, },
    { 'time.finished': Date(), },
    { returnNewDocument: true});
  return res.json(game);
};
