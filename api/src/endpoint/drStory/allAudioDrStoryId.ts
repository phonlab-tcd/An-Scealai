import { ObjectId } from "mongodb";

const DigitalReaderSentenceAudio = require('../../models/drSentenceAudio');
const User = require('../../models/user');
const mongoose = require('mongoose');
const {API404Error} = require('../../utils/APIError');

// get stories by owner (user) ID
const handler =  async (req, res) => {
  /*const user = await User.findOne({'_id': req.params.id});
  if (!user) {
    throw new API404Error(`User with id ${req.params.id} not found.`);
  }*/
  try {
    console.log(req.params)
    console.log(req.params.drStoryId)
    const objId = new ObjectId(req.params.drStoryId);
    console.log(objId);
    
    //const digitalReaderSentenceAudios = await DigitalReaderSentenceAudio.find({'_id': objId});
    const digitalReaderSentenceAudios = await DigitalReaderSentenceAudio.find({'drStoryId': objId});

    console.log(digitalReaderSentenceAudios)

    if (!DigitalReaderSentenceAudio) {
      return res.status(200).json([]);
      //throw new API404Error(`No stories written by user with id ${req.params.id} were found.`);
    }
    return res.status(200).json(digitalReaderSentenceAudios);
  } catch {
    return res.status(200).json([]);
  }
};

export = handler;