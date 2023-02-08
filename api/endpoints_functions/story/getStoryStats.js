const Story = require('../../models/story');
const winkNLP = require('wink-nlp');
const model = require('wink-eng-lite-web-model');

const nlp = winkNLP(model);
const STOP_WORDS = ['.', ',', '?', '!', '\n', ';', '-', ':', '"', '\''];

/**
 * Gets story statistics such as total stories and average word count
 * @param {Object} req
 * @param {Object} res
 * @return {Promise} Dictionary of story statistics
 */
async function getStoryStats(req, res) {
  const totalStories = await Story.countDocuments();
  const totalRecordings = await Story.where({'activeRecording': {$ne: null}}).countDocuments();

  const stories = await Story.find();
  let avgWordCount = 0;
  const wordCounts = [];
  let totalWords = 0;

  if (stories.length > 0) {
    stories.forEach((story) => {
      if (story.text) {
        const textTokens = nlp
            .readDoc(story.text)
            .tokens()
            .out()
            .filter((token) => !STOP_WORDS.includes(token));
        wordCounts.push(textTokens.length);
        totalWords += textTokens.length;
      }
    });

    avgWordCount = Math.round(wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length);
  }

  return res.status(200).json({
    totalStories: totalStories,
    totalWords: totalWords,
    avgWordCount: avgWordCount,
    totalRecordings: totalRecordings,
  });
}

module.exports = getStoryStats;
