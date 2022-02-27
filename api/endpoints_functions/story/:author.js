const Story = require.main.require('./models/story');
module.exports =  (req, res) => {
  if(req.user.role !== "ADMIN" && req.user.username !== req.params.author)
    return res.status(401).send();
  Story.find({"author": req.params.author}, function (err, stories) {
    if(err) {
      console.log(err);
      res.json(err)
    } else {
      res.json(stories);
    }
  });
};
