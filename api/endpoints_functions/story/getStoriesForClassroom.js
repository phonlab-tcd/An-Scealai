const Story = require.main.require('./models/story');

module.exports = (req, res, next) => {
  Story.find({author: req.params.author, date: {$gte: req.params.date}},
    (err, stories) => {
      if(err) 
        return next(err);
      res.json(stories);
  });
}
