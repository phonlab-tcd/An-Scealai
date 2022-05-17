const Story = require('../../models/story');
const {API404Error} = require('../../utils/APIError');

async function getStoryById(req, res, next) {
  Story.findById(req.params.id).then(
    story=>{
      if (!story)
        return next(new API404Error(`Story with id ${req.params.id} not found`));
      console.dir(story);
      return res.status(200).json(story);
    },
    error=>next(error),
  )
}

module.exports = getStoryById;
