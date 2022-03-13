const DescribeGame = require('../../../models/description-game/describe-game');
const User = require('../../../models/user');
const ObjectId = require('mongoose').Types.ObjectId;
const fs = require('fs').promises;
const path = require('path');
const imageDir = require('../../../utils/imageDir');
const { API400Error } = require('../../../utils/APIError');
const AudioMessage = require('../../../models/audioMessage');

async function validParams(params, res, next) {
  params.public = params.public === false ? false : true;
  console.log(imageDir);
  if(!params.audioMessages) {
    res.status(400);
    next(new API400Error('audioMessages not defined'));
    return false;
  }
  for(const param of ['reciptients','audioMessages']) {
    try { params[param] = params[param].map(v=>ObjectId(v)); }
    catch (e) { next(e); return false; }
  }
  try { 
    const promises = [
      fs.stat(path.join(imageDir,''+params.imagePath)),
    ];
    await Promise.all(promises); }
  catch (e) { next(e); return false; }
  return true;
};

module.exports = {};
module.exports.get = async (req,res,next) => {
  const currentGame = await DescribeGame.findOne(
    {ownerId: ObjectId(req.user._id), 'time.finished': null });
  if(currentGame) {
    if(!currentGame.imagePath) {
      // TODO make this a method so that next image is tailored to user
      currentGame.imagePath = User.newImagePathForDescribeGame();
      await currentGame.save();
    }
    return res.json(currentGame);
  };
  console.log(req.user);
  console.log(req.user.methods);
  const newGame = await DescribeGame.create({
    ownerId: req.user._id,
    public: false,
    published: false,
    recipients: [],
    audioMessages: [],
    // TODO make this a method so that next image is tailored to user
    imagePath: User.newImagePathForDescribeGame(),
    time: {
      started: new Date(),
      finished: null,
    },
  });
  res.json(newGame);
};
