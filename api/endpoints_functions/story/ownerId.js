const Story = require('../../models/story');
const User = require('../../models/user');
const mongoose = require('mongoose');
const {API404Error} = require('../../utils/APIError');

// get stories by owner (user) ID and add property if it doesn't exist
module.exports = async (req, res) => {
  const user = await User.findOne({'_id': req.params.id});
  const oldStories = await Story.find({'author': user.username, 'owner': {$exists: false}});

  // add the 'owner' property to any stories that don't have it
  if (oldStories) {
    for (const story of oldStories) {
      story.owner = mongoose.Types.ObjectId(req.params.id);;
      try {
        await story.save();
      }
      catch {
        console.log('ownerId.js: This story id might be a string, cannot set owner property: ', story._id);
      }
    }
  }

  const stories = await Story.find({'owner': req.params.id});


  if (!stories) {
    throw new API404Error(`No stories written by user with id ${req.params.id} were found.`);
  }
  return res.status(200).json(stories);
};
