const DigitalReaderStory = require('../../models/drStory');
//const User = require('../../models/user');
const mongoose = require('mongoose');
const {API404Error} = require('../../utils/APIError');

// get stories by owner (user) ID
const handler =  async (req, res) => {

  try {
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
  } catch {
    return res.status(400).json([]);
  }
};

export = handler;