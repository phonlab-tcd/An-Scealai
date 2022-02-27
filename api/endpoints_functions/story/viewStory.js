const Story = require.main.require('./models/story');
module.exports = (req, res, next) => {
  Story.find({_id:req.params.id}, (err, story) => {
    if(err)
      return next(err);
    res.json(story);
  });
};
