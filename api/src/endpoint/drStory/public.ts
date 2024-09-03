const DigitalReaderStory = require('../../models/drStory');
//const User = require('../../models/user');
const mongoose = require('mongoose');
const {API404Error} = require('../../utils/APIError');

// get stories by owner (user) ID
const handler =  async (req, res) => {
  
  try {
    const digitalReaderStories = await DigitalReaderStory.find({'public': 'true'}).sort({$natural:-1});

    if (!digitalReaderStories) {
      throw new API404Error(`No publicly available Digital Reader stories were found.`);
    }
    return res.status(200).json(digitalReaderStories);
  } catch {
    return res.status(200).json([]);
  }
};

export = handler;