const synth = require('../../utils/synth');
module.exports = async (req, res) => {
  console.dir(req.query);
  const body = synth.synthesiseSingleSentenceDNN(req.query)
    .then(body => {
      return res.send(body);
    });
};
