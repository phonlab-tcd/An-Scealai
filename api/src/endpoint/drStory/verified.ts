const DigitalReaderStory = require('../../models/drStory');
//const User = require('../../models/user');
const mongoose = require('mongoose');
const {API404Error} = require('../../utils/APIError');

// get stories by owner (user) ID
const handler =  async (req, res) => {
  /*const user = await User.findOne({'_id': req.params.id});
  if (!user) {
    throw new API404Error(`User with id ${req.params.id} not found.`);
  }*/
  
  //const digitalReaderStories = await DigitalReaderStory.find({'public': 'true'}).sort({$natural:-1});

  /*if (!digitalReaderStories) {
    throw new API404Error(`No publicly available Digital Reader stories were found.`);
  }*/

  // Get all documents whose owners carry the ADMIN role
  const digitalReaderStories = await DigitalReaderStory.aggregate([
    {$lookup: {
      from: 'users',
      localField: 'owner',
      foreignField: '_id',
      as: 'ownerDocArr'
    }},
    {$project: {
      title: 1,
      ownerDoc: {$first: '$ownerDocArr'}
    }},
    {$project: {
      title: 1,
      ownerRole: '$ownerDoc.role'
    }},
    {$match: {
      ownerRole: "ADMIN"
    }}
  ])

  if (!digitalReaderStories) {
    throw new API404Error(`No An Scéalaí-verified Digital Reader stories were found.`);
  }
  
  return res.status(200).json(digitalReaderStories);
};

export = handler;