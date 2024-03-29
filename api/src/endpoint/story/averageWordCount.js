const Story = require('../../models/story');

const winkNLP = require( 'wink-nlp' );
const model = require('wink-eng-lite-web-model');

// @ts-ignore
const nlp = winkNLP( model );
const STOP_WORDS = ['.', ',', '?', '!', '\n', ';', '-', ':', '\"', '\''];

/**
 * Get average wordcount of stories given a student ID
 * @param {Object} req The student's id number
 * @param {Object} res The object to store the response
 * @return {Promise} Student's average word count
 */
module.exports = async (req, res) => {
  const conditions = {'owner': req.params.studentId};
  if (req.body.startDate !== '' && req.body.endDate !== '') {
    conditions['updatedAt'] = {
      '$gte': req.body.startDate,
      '$lte': req.body.endDate,
    };
  };

  const stories = await Story.find(conditions);
  if (stories.length > 0) {
    const wordCounts = [];

    stories.forEach((story) => {
      const textTokens = nlp.readDoc(story.text).tokens()
          .out()
          .filter((token) => !STOP_WORDS.includes(token));
      wordCounts.push(textTokens.length);
    });

    const average = Math.round(wordCounts.reduce((a, b) => a + b, 0) /
     wordCounts.length);

    res.status(200).json({avgWordCount: average});
  } else {
    res.status(200).json({avgWordCount: 0});
  }
};
