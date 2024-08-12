const DigitalReaderSentenceAudio = require('../../models/drSentenceAudio');
const DigitalReaderStory = require('../../models/drStory');
const {API500Error} = require('../../utils/APIError');
const axios = require('axios');

const mongoose = require('mongoose');

const http = axios.create({
  baseURL: "https://abair.ie/api2",
  headers: {
    "Content-Type": "application/json",
    //"Access-Control-Allow-Origin": "*"
  }
});

/**
 * Creates a new story document on the DB.
 * @param {Object} req body: Story object
 * @return {Promise} 
 */

//function test (req:any) {
async function synthesiseAndStoreSent (req:any) {

  function yes() {
    return new Promise(
      async (resolve, reject) => {

          // if the sentence audio is not already stored in the db
          const story = await DigitalReaderSentenceAudio.find({
            drStoryId: req.body.drStoryId,
            sentenceId: req.body.sentenceId,
            voice: req.body.voiceCode
          });
          console.log(story)
          if (!(Array.isArray(story) && story.length!==0) && drStory) {

            // make a call to the synthesis API
            console.log('storing!')
            const audioObj = await http.post('/synthesise', 
              reqBody
            )
            .catch( (err) => {
              //console.log(err);
              resolve('error synthesising the audio')
              return;
            });

            console.log(audioObj);
            if (audioObj) {
            
              const storedSent = await DigitalReaderSentenceAudio.create({
                drStoryId: req.body.drStoryId,
                sentenceId: req.body.sentenceId,
                voice: req.body.voiceCode,
                // currently only supports mp3 files
                audioUrl: `data:audio/mp3;base64,` + audioObj.data.audioContent, // audioContent goes to audioUrl for compatibility with synthesis service
                timing: audioObj.data.timing
              });
              resolve('Response: ' + storedSent)
              return;

            }
          }
          resolve('error storing the audio')
    })
  }

  function no() {
    return Promise.resolve(1);
  }

  // make sure all necessary body params are present
  if (req.body===undefined) return no();

  if (req.body.textInput===undefined) return no();
  if (req.body.voiceCode===undefined) return no();
  if (req.body.audioEncoding===undefined) return no();
  if (req.body.speed===undefined) return no();

  if (req.body.drStoryId===undefined) return no();
  if (req.body.sentenceId===undefined) return no();

  let reqBody: any;

  // check that the story still exists (hasn't been deleted)
  //const drStory = await DigitalReaderStory.findOne({drStoryId: req.body.drStoryId});
  const drStory = await DigitalReaderStory.findById(new mongoose.mongo.ObjectId(req.body.drStoryId))
  console.log(drStory)
  if (!drStory) return no();

  // prepare the body of the call to the synthesis API
  reqBody = {
    synthinput: {
      text: req.body.textInput,
      normalised: true,
    },
    voiceparams: {
      languageCode: "ga-IE",
      name: req.body.voiceCode,
    },
    audioconfig: {
      audioEncoding: req.body.audioEncoding,
      speakingRate: req.body.speed,
      pitch: 1,
    },
    timing: "WORD"
  };

  return yes();
}

export = synthesiseAndStoreSent;