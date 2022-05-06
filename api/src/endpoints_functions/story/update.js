const Story = require.main.require('./models/story');
const logger = require.main.require('./logger');
const ObjectID = require('mongodb').ObjectID;

module.exports = (req, res, next) => {
  logger.info({updateStory: req.params.id});
  if(!req.body)
    return next(new Error('req.body empty'));

  Story.findById(req.params.id, (err, story) => {
    // FORWARD ERROR
    if (err) 
      return next(err)
    // EXISTENCE CHECK
    if (!story)
      return next(
        new Error({
          message: 'story does not exist',
          storyId: req.params.id}));
    // AUTHORIZATION
    if (story.studentId != req.user._id || !ObjectID.isValid(story.studentId))
      return res.status(401).send();
    // UPDATE FIELDS
    for (const field of ['text','htmlText','lastUpdated','dialect','title'])
      story[field] = req.body[field] || story[field];
    // SAVE UPDATES
    story.save()
      .then (()     => res.json(story))
      .catch((err)  => next(err));
  });
};
