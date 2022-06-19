const ERROR = require('../../utils/APIError');
const Story = require('../../models/story');
const ok=s=>({ok:s});
const err=e=>({err:e});
const either=promise=>promise.then(ok,err);
const valid = {
  update: {
    text(t) { if(typeof t === 'string') return t; return undefined },
  }
};
function option(t) { if(t)return t; return undefined }
async function post(req, res){
    const $set = {
      text:         valid.update.text(req.body.text),
      htmlText:     valid.update.text(req.body.htmlText),
      title:        valid.update.text(req.body.title),
      dialect:      valid.update.text(req.body.dialect),
      lastUpdated:  option(req.body.lastUpdated),
    }
    const query = {_id: req.params.id};
    const up = {$set};
    const opts = {new:true,useFindAndModify:true};
    const story  = await either(Story.findOneAndUpdate(query,up,opts))
    if (story.err)  throw new ERROR.API400Error(story.err);
    if (!story.ok)  throw new ERROR.API404Error();
    return res.json(story.ok);
}
module.exports = {post};
