const Story = require('../../models/story');
import { getWordCount } from "../nlp/getWordCount";

/**
 * Gets story statistics such as total stories and average word count
 * @param {Object} req
 * @param {Object} res
 * @return {Promise} Dictionary of story statistics
 */
async function getStoryStats(req, res) {
  const totalStories = await Story.countDocuments();
  const totalRecordings = await Story.where({'activeRecording': {$ne: null}}).countDocuments();

  const storyTextsResponse = await Story.find({'text': {$ne: null}},{'text': 1, '_id': 0})  // get text from all stories in the DB
  const storyTexts = storyTextsResponse.map( (item) => {return item.text}) // make an array of story texts from DB res
  const wordCountResponseStory = getWordCount(storyTexts);

  const totalFeedback = await Story.find({$or: [{'feedback.text': {$ne: null}}, {'feedback.audioId': {$ne: null}}]}).countDocuments();
  const onlyTextFeedback = await Story.where({$and: [{'feedback.text': {$ne: null}}, {'feedback.audioId': null}]}).countDocuments();
  const onlyAudioFeedback = await Story.where({$and: [{'feedback.audioId': {$ne: null}}, {'feedback.text': null}]}).countDocuments();
  const bothAudioAndText = await Story.find({$and: [{'feedback.text': {$ne: null}}, {'feedback.audioId': {$ne: null}}]}).countDocuments();

  const feedbackTextsResponse = await Story.find({'feedback.text': {$ne: null}},{'feedback.text': 1, '_id': 0})  // get feedback text from all stories in the DB
  const feedbackTexts = feedbackTextsResponse.map( (item) => {return item.feedback.text}) // make an array of feedback texts from DB res
  const wordCountResponseTeacher = getWordCount(feedbackTexts);

  return res.status(200).json({
    totalStories: totalStories,
    totalRecordings: totalRecordings,
    totalWords: wordCountResponseStory['totalWords'],
    avgWordCount: wordCountResponseStory['avgWordCount'],
    totalFeedback: totalFeedback,
    onlyTextFeedback: onlyTextFeedback,
    onlyAudioFeedback: onlyAudioFeedback,
    bothAudioAndText: bothAudioAndText,
    totalFeedbackWords: wordCountResponseTeacher['totalWords'],
    avgFeedbackWordCount: wordCountResponseTeacher['avgWordCount'],
  });
}

module.exports = getStoryStats;
