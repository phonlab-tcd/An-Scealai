const Story = require('../../models/story');
const User = require('../../models/user');
const mongoose = require('mongoose');
const {API404Error} = require('../../utils/APIError');

// get stories by owner (user) ID
const handler =  async (req, res) => {
  const user = await User.findOne({'_id': req.params.id});
  if (!user) {
    throw new API404Error(`User with id ${req.params.id} not found.`);
  }
  
  const stories = await Story.find({'owner': req.params.id}).sort({$natural:-1});

  if (!stories) {
    throw new API404Error(`No stories written by user with id ${req.params.id} were found.`);
  }
  return res.status(200).json(stories);
};

export = handler;