const Story = require('../../models/story');
const {requestGrammarTags} = require('../../utils/grammar');

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
  delete storyUpdate._doc.storyId;

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
        responseObject.saveStoryError = error;
      }) || false;

  if (!responseObject.savedStory) {
    responseObject.storyWithIdNotFound = req.body._id;
  }

  responseObject.grammarTagsEnglish =
    await grammarTagsEnglishPromise.catch((error) => {
      responseObject.englishGramadoirError = error;
    }) || false;

  responseObject.grammarTagsIrish =
    await grammarTagsIrishPromise.catch((error) => {
      responseObject.irishGramadoirError = error;
    }) || false;

  let status = 200;

  if (responseObject.saveStoryError) {
    status = 404;
  } else if (responseObject.englishGramadoirError) {
    status = englishGramadoirError.status;
  } else if (responseObject.irishGramadoirError) {
    status = irishGramadoirError.status;
  }

  return res.status(status || 500).json(responseObject);
};
