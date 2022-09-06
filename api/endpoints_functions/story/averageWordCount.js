const Story = require('../../models/story');

module.exports = async (req, res) => {
  console.log('Function reached!!!!!!!!!');
  console.log('StudentId: ', req.params.studentId);
  const stories = await Story.find({'studentId': req.params.studentId});
  console.log('stories: ', stories);
  if (stories.length > 0) {
    const wordCounts = [];

    for (let i = 0; i < stories.length; i++) {
      console.log(stories[i].author);
      const words = [];
      const str = stories[i].text.replace(/[\t\n\r\.\?\!]/gm, ' ').split(' ');
      str.map((s) => {
        const trimStr = s.trim();
        if (trimStr.length > 0) {
          words.push(trimStr);
        }
      });
      console.log('Words: ', words);
      wordCounts.push(words.length);
    }

    console.log('Word counts: ', wordCounts);
    const average = Math.round(wordCounts.reduce((a, b) => a + b, 0)
     / wordCounts.length);
    console.log('Average: ', average);

    res.status(200).json({avgWordCount: average});
  } else {
    res.status(200).json({avgWordCount: 0});
  }
};
