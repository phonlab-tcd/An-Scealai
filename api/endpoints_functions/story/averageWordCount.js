const Story = require('../../models/story');

/**
 * Add two numbers.
 * @param {Object} req The student's id number
 * @param {Object} res The object to store the response
 * @return {Object} Student's average word count
 */
module.exports = async (req, res) => {
  const stories = await Story.find({'studentId': req.params.studentId});
  if (stories.length > 0) {
    const wordCounts = [];

    for (let i = 0; i < stories.length; i++) {
      const words = [];
      const str = stories[i].text.replace(/[\t\n\r\.\?\!]/gm, ' ').split(' ');
      str.map((s) => {
        const trimStr = s.trim();
        if (trimStr.length > 0) {
          words.push(trimStr);
        }
      });
      wordCounts.push(words.length);
    }

    const average = Math.round(wordCounts.reduce((a, b) => a + b, 0) /
     wordCounts.length);

    res.status(200).json({avgWordCount: average});
  } else {
    res.status(200).json({avgWordCount: 0});
  }
};
