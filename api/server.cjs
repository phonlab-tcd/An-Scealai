
// Best to initialize the logger first
const logger = require('./logger.cjs');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const errorHandler = require('./utils/errorHandler.cjs');
require('./config/passport.cjs');

const storyRoute = require('./routes//story.route.cjs');
const userRoute = require('./routes/user.cjs.route');
const teacherCodeRoute = require('./routes/teacherCode.route');
const classroomRoute = require('./routes/classroom.route');
const chatbotRoute = require('./routes/chatbot.route');
const engagementRoute = require('./routes/engagement.route');
const statsRoute = require('./routes/stats.route');
const albumRoute = require('./routes/album.route');
const profileRoute = require('./routes/profile.route');
const messageRoute = require('./routes/messages.route');
const studentStatsRoute = require('./routes/studentStats.route');
const recordingRoute = require('./routes/recording.route');
const mailRoute = require('./routes/send_mail.route');
const gramadoirLogRoute = require('./routes/gramadoir_log.route');

const dbURL = require('./utils/dbUrl.cjs');

// use this to test where uncaughtExceptions get logged
// throw new Error('test error');

logger.info('DB url: ' + dbURL);
mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);

async function prodConnection() {
  const useNewUrlParser = true;
  const useUnifiedTopology = true;
  const serverSelectionTimeoutMS = 1000;
  const heartbeatFrequencyMS = 100;
  const opts = {
    useNewUrlParser,
    useUnifiedTopology,
    heartbeatFrequencyMS,
    serverSelectionTimeoutMS,
  };
  await mongoose.connect(dbURL, opts);
  logger.info(`connected ${dbURL}`);
}

if(process.env.NODE_ENV !== 'test') {
  prodConnection();
}

const app = express();
app.use('/version', require('./routes/version.route'));
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());

app.use('/story.cjs', storyRoute);
app.use('/user.cjs', userRoute);
if(process.env.FUDGE) {
  console.log('ADD FUDGE VERIFICATION ENDPOINT');
  app.get('/user.cjs/fudgeVerification/:username', (req,res,next)=>{
    console.log(req.query);
    const User = require('./models/user.cjs');
    User.findOneAndUpdate(
      {username: req.params.username},
      {$set: {status: 'Active'}}).then(
        u => {logger.info(u);           res.json(u)},
        e => {logger.error(e.stack);    res.json(e)},
      );
  });
}
app.use('/teacherCode', teacherCodeRoute);
app.use('/classroom', classroomRoute);
app.use('/Chatbot', chatbotRoute);
app.use('/engagement', engagementRoute);
app.use('/stats', statsRoute);
app.use('/album', albumRoute);
app.use('/profile', profileRoute);
app.use('/messages', messageRoute);
app.use('/studentStats', studentStatsRoute);
app.use('/gramadoir', gramadoirLogRoute);
app.use('/recordings', recordingRoute);

app.use('/proxy',async (req,res,next)=>{
  function allowUrl(url) {
    const allowedUrls = /^https:\/\/phoneticsrv3.lcs.tcd.ie\/nemo\/synthesise|https:\/\/www.abair.ie\/api2\/synthesise/;
    return !! allowedUrls.exec(url);
  }
  if(!allowUrl(req.body.url)) return res.status(400).json('illegal url');
  const proxyRes = await require('axios').get(req.body.url).then(ok=>({ok}),err=>({err}));
  if(proxyRes.err) {
    console.error(proxyRes);
    return res.status(+proxyRes.err.status || +proxyRes.err.response.status || 500).json(proxyRes.err);
  }
  res.json(proxyRes.ok.data);
});

const synthesisRoute = require('./routes/synthesis.route');
app.use('/synthesis', synthesisRoute);

app.use('/mail', mailRoute);
app.use('/log', require('./routes/log.route'));

const port = process.env.PORT || 4000;

app.use(errorHandler);

// We don't want to call app.listen while testing
// See: https://github.com/visionmedia/supertest/issues/568#issuecomment-575994602
if (process.env.TEST != 1) {
  const server = app.listen(port, function(){
      logger.info('Listening on port ' + port);
  });
}

module.exports = app;
