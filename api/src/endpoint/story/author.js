const Story = require('../../model/story');
const ERROR = require('../../util/APIError');

const ok = ok => ({ok});
const err = err => ({err});
const either = promise => promise.then(ok,err);
/**
 * @returns a list of stories written by the 'author' param
 */
module.exports = async (req, res) => {
  const stories = await either(Story.find({"author": req.params.author}));
  if (stories.err) throw new ERROR.API400Error(stories.err);
  if (!stories.ok) throw new ERROR.API404Error(`No stories written by ${req.params.author} were found.`);
  return res.json(stories.ok);
}
