const DescribeGame = require('../../../models/description-game/describe-game');

module.exports = {}
module.exports.delete = async (req,res,next) => {
  console.log('DELETE MESSAGE FROM DESCRIBE GAME');
  const doc = await DescribeGame.updateOne({
    _id: req.params.gameId,
    ownerId: req.user._id,
  },{
    $pull: {
      audioMessages: req.params.messageId
    }
  });
  return res.json(doc);
};
