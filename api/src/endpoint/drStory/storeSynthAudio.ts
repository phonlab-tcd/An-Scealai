/* Deprecated */

import { API500Error } from "../../utils/APIError";

const DigitalReaderSentenceAudio = require('../../models/drSentenceAudio');
const DigitalReaderStory = require('../../models/drStory');

const {API404Error} = require('../../utils/APIError');

const handler =  async (req, res) => {

  function yes() {
    res.status(200).json({id: audio._id});
  }
  function no(status=404, msg='not found') {
    res.status(status).json(msg);
  }

  let audio;
  
  try {
    //if (!req.body.audioPromise) return no(501, 'no audio promise provided');
    if (!req.body.audioUrl) return no(501, 'no audio url provided');
    if (!req.body.audioTiming) return no(501, 'no audio timing provided');
    if (!req.body.drStoryId) return no(501, 'no story id provided');
    if (req.body.sentId === undefined) return no(501, 'no sentence id provided');
    if (!req.body.voice) return no(501, 'no voice code parameter provided');

    // check that the current user owns the provided story (or is an admin) (?)

    // check that the story still exists (hasn't been deleted)
    const drStory = DigitalReaderStory.find({drStoryId: req.body.drStoryId});
    if (!drStory) return no();
    
    audio;
    
    audio = await DigitalReaderSentenceAudio.create({
      drStoryId: req.body.drStoryId,
      sentenceId: req.body.sentId,
      voice: req.body.voice,
      audioUrl: req.body.audioUrl,
      timing: req.body.audioTiming,
    });
    if (!audio) {
      throw new API500Error('Unable to save audio file to DB. It may be too large');
    }
    yes();

    return no();
  } catch {
    return no();
  }

};

export = handler;