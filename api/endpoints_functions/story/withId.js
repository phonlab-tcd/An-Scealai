const Story = require('../../models/story');
const {API404Error} = require('../../utils/APIError');
const classroomsOfUser = require('../../utils/classroomsOfUser');

const inArray = (item, array) => array.indexOf(item) >= 0;

module.exports = async (req, res, next) => {
  console.log('withId');
  function yes() { res.json(story)}
  function no() {res.status(404).json()}
  if(!req.user) return res.status(400).json('need to know user');
  if(!req.user._id) return res.status(400).json('need to know user\'s id');
  const story = await Story.findById(req.params.id);
  if (!story) return no();
  if(story.owner === req.user._id) return yes();
  return no();
}
