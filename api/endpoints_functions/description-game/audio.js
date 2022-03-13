const app = require('../../server');
const fs = require('fs').promises;
const path = require('path');
const AudioMessage = require('../../models/audioMessage');
const DescribeGame = require('../../models/description-game/describe-game');
const ObjectId = require('mongoose').Types.ObjectId;

function validAudioFiles(files)  {
  if(!files) return false;
  for(const f of files) if(!f.buffer || !f.mimetype) return false;
  return true;
}

async function ensureDirExists(dir) {
  return fs.mkdir(dir).catch(e=>{
    if(e.code==='EEXIST')return
    else throw e
  })
}

const apiRootDir = path.join(__dirname,'..','..');
module.exports = {}
// POST /description-game/audio/
module.exports.post = async (req,res,next) => {
  if(!validAudioFiles(req.files))
    return next(new Error('req.files is not valid'));
  app.logger.info({
    route: '/description-game/audio',
    user: req.user,
    body: req.body,
    numFiles: req.files.length,
  });
  const dir = path.join(apiRootDir, 'audioMessages', req.user._id.toString());
  const [_, audioMessages] = await Promise.all([
    ensureDirExists(dir),
    AudioMessage.create(req.files.map(file => {
      return {
        ownerId: req.user._id,
        public: true,
        mimetype: file.mimetype,
        recipients: [],
        time: {
          start: req.body.time_start,
          stop: req.body.time_stop,
          ready: req.body.time_ready,
        }
      }
    })),
  ]);
  await audioMessages.map(async (am,i)=>{
    await fs.writeFile(am.path(), req.files[i].buffer)
  });
  res.json(audioMessages.map(am=>am.forFrontend()));

  try {
  if(req.body.game_type ) {
    console.log(req.body);
    switch(req.body.game_type) {
      case 'describe':
        DescribeGame.updateOne(
          {_id: ObjectId(req.body.game_id)},
          { $push: {audioMessages: audioMessages }},
          (err,doc)=>{
            console.error(err);
            console.log(doc);
          }); 
        break;
    }
  }
  } catch (e) {
    console.error(e);
  }

}

// GET /description-game/audio/:id
// req.params.id
module.exports.get = async (req,res,next)=>{
  const am = await AudioMessage.findById(req.params.id);
  if(!(req.user._id.toString() === am.ownerId.toString()))
    return res.sendStatus(401); 
  res.set('Content-Type', am.mimetype);
  try {
    await fs.access(am.path());
  } catch (e) {
    console.log('FILE DOES NOT EXIST');
    console.log(am.path());
    console.log('DELETING META DATA FROM DB');
    am.remove({_id: am._id});
    return res.sendStatus(404);
  }
  try {
    const data = await fs.readFile(am.path(), {encoding: 'base64'});
    return res.send(data);
  }
  catch (e){
    next(e);
  }
}
