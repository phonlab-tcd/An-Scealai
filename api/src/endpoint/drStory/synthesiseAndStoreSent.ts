const DigitalReaderSentenceAudio = require('../../models/drSentenceAudio');
const {API500Error} = require('../../utils/APIError');
const axios = require('axios');


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
          if (!(Array.isArray(story) && story.length!==0)) {
            console.log('storing!')
            const audioObj = await http.post('/synthesise', 
              reqBody
            );
            console.log(audioObj);
            const storedSent = await DigitalReaderSentenceAudio.create({
              drStoryId: req.body.drStoryId,
              sentenceId: req.body.sentenceId,
              voice: req.body.voiceCode,
              // currently only supports mp3 files
              audioUrl: `data:audio/mp3;base64,` + audioObj.data.audioContent, // audioContent goes to audioUrl for compatibility with synthesis service
              timing: audioObj.data.timing
            });
          }
          resolve('Response: ' + req.body.textInput)
          //console.log(audioObj)
          
          
          //resolve(0);
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

  // check that the sent does not already exist in the db
  /*if (!DigitalReaderSentenceAudio.find({
    drStoryId: req.body.drStoryId,
    sentenceId: req.body.sentenceId,
    voice: req.body.voiceCode
  })) {*/

    // make a call to the synthesis API
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

    //const tmp = axios.post('/synthesise', reqBody)
    //console.log(tmp)

    //setTimeout(()=>console.log('event over!'), 500);
    /*const audioObj = await http.post('/synthesise', 
      reqBody,
      {headers: {
        "Content-Type": "application/json",
      }}
    );

    console.log(audioObj)*/

    /*{headers: {
      "Content-Type": "application/json",
  }}*/

    

    //console.log(audioObj)

    // TODO : store the result in the DB.
    /*if (audioObj) {
      const storedSent = await DigitalReaderSentenceAudio.create({
        drStoryId: req.body.drStoryId,
        sentenceId: req.body.sentId,
        voice: req.body.voice.code,
        audioUrl: audioObj.audioUrl,
        timing: audioObj.timing
      });

      if (!storedSent) {
        return no();
      }
    }*/
  //}

  return yes();

  /*return new Promise(
    (resolve, reject) => {
      
      setTimeout( () =>
        resolve('test resolution!'), 1000
      )
      // above should be changed to an await of the a call to the synth api
  })*/
}

export = synthesiseAndStoreSent;