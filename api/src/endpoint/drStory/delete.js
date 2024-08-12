const DigitalReaderStory = require('../../models/drStory');
const DigitalReaderSentenceAudio = require('../../models/drSentenceAudio');

/**
 * Deletes a drStory document from the DB along with its associated synthesised audio.
 * @param {Object} req params: drStoryId: the id of the drStory to remove
 * @param {Object} res
 */
module.exports = async (req, res) => {
  let storyFoundAndRemoved = false;

  DigitalReaderStory.findOneAndRemove({ _id: req.params.drStoryId }, (err, drStory) => {
    if (err) {
      console.log(err);
      return res.json(err);
    } else storyFoundAndRemoved = true; 
  })
  
  if (storyFoundAndRemoved) {
    DigitalReaderSentenceAudio.remove(
      {drStoryId: req.params.drStoryId},
      (err, sentenceAudios) => {
        if (err) {
          console.log(err);
          res.json(err);
        } else res.json('Digital Reader Story removed sucessfully')
      }
    )
  }
};