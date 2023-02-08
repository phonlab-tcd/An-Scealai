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

  const storyTextsResponse = await Story.find({},{'text': 1, '_id': 0})  // get text from all stories in the DB
  const storyTexts = storyTextsResponse.map( (item) => {return item.text}) // make an array of story texts from DB res

  const wordCountResponse = getWordCount(storyTexts);

  return res.status(200).json({
    totalStories: totalStories,
    totalRecordings: totalRecordings,
    totalWords: wordCountResponse['totalWords'],
    avgWordCount: wordCountResponse['avgWordCount'],
  });
}

module.exports = getStoryStats;
