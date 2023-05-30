const Story = require('../../models/story');
const {requestGrammarTags} = require('../../utils/grammar');
const logger = require('../../logger');

/**
 * Grammar check a story and update its status
 * @param {Object} req body: Story object
 * @param {Object} res
 * @return {Promise} Success or Error Message
 */
module.exports = async (req, res) => {
  const storyUpdate = new Story(req.body);

  const validationError = storyUpdate.validateSync();
  if (validationError) {
    return res.status(400).json({
      validationError: validationError,
    });
  }

  // DON'T UPDATE THE STORY'S _id
  delete storyUpdate._doc._id;

  // UPDATE STORY ASYNCHRONOUSLY
  // AND MAKE GRAMADOIR REQUESTS WHILE THAT'S HAPPENING
  const updateStoryPromise =
    Story.findByIdAndUpdate(req.body._id, storyUpdate, {new: true});

  const grammarTagsEnglishPromise =
    requestGrammarTags(storyUpdate.text, 'en');

  const grammarTagsIrishPromise =
    requestGrammarTags(storyUpdate.text, 'ga');

  // START BUILDING UP THE RESPONSE OBJECT
  const responseObject = {};

  responseObject.savedStory =
      await updateStoryPromise.catch((error) => {
        logger.error(error);
        responseObject.saveStoryError = error;
      }) || false;

  if (!responseObject.savedStory) {
    responseObject.storyWithIdNotFound = req.body._id;
  }

  responseObject.grammarTagsEnglish =
    await grammarTagsEnglishPromise.catch((error) => {
      logger.error(error);
      responseObject.englishGramadoirError = error;
    }) || false;

  responseObject.grammarTagsIrish =
    await grammarTagsIrishPromise.catch((error) => {
      logger.error(error);
      responseObject.irishGramadoirError = error;
    }) || false;

  let status = 200;

  if (responseObject.saveStoryError) {
    status = 404;
  } else if (responseObject.englishGramadoirError) {
    status = responseObject.englishGramadoirError.status;
  } else if (responseObject.irishGramadoirError) {
    status = responseObject.irishGramadoirError.status;
  }

  logger.info({endpoint: req.url, responseObject});
  return res.status(status || 500).json(responseObject);
};
