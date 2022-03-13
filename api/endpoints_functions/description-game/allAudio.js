const app = require('../../server');
const fs = require('fs').promises;
const path = require('path');
const AudioMessage = require('../../models/audioMessage');

function validAudioForms(files)  {
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

// GET /description-game/allAudio/
// req.params.id
module.exports.get = async (req,res,next)=>{
  const ams = await AudioMessage.find({ownerId: req.user._id});
  const ret = ams.map(am=>am._id);
  console.log(ret);
  return res.json(ret);
}
