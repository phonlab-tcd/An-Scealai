const fs = require('fs').promises;
const AudioMessage = require('../../../models/audioMessage');
const ObjectId = require('mongoose').Types.ObjectId;

function equalIds(a,b) {
  return a.toString() === b.toString();
}

// GET /description-game/meta/audio/:id
// req.params.id
module.exports.get = async (req,res,next)=>{
  if(!ObjectId.isValid(req.params.id))
    return next(new Error('bad audioMessage.id: ' + req.params.id));
  const am = await AudioMessage.findById(req.params.id);
  if(!am)                                 return res.sendStatus(404);
  if(!equalIds(req.user._id,am.ownerId))  return res.sendStatus(401); 
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
    res.json(am);
  }
  catch (e){
    next(e);
  }
}
