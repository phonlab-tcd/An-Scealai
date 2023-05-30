if(process.env.NODE_ENV==='prod') require('./keys/load');
else require('./keys/dev/load');

const logger = require('./logger');  // Best to initialize the logger first
const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const axios = require('axios');
const errorHandler = require('./utils/errorHandler');
const checkJwt = require('./utils/jwtAuthMw');
const dbURL = require('./utils/dbUrl');
const jwtAuthMw = require('./utils/jwtAuthMw'); // DUPLICATE, NOT USED ? 
require('./config/passport');
const expressQueue = require('express-queue');

const storyRoute = require('./routes/story.route');
const userRoute = require('./routes/user.route');
const teacherCodeRoute = require('./routes/teacherCode.route');
const classroomRoute = require('./routes/classroom.route');
const chatbotRoute = require('./routes/chatbot.route');
const engagementRoute = require('./routes/engagement.route');
const statsRoute = require('./routes/stats.route');
const profileRoute = require('./routes/profile.route');
const promptRoute = require('./routes/prompt.route');
const messageRoute = require('./routes/messages.route');
const recordingRoute = require('./routes/recording.route');
const gramadoirLogRoute = require('./routes/gramadoir_log.route');
const synthesisRoute = require('./routes/synthesis.route');
const nlpRoute = require('./routes/nlp.route');

/* use this to test where uncaughtExceptions get logged */
// throw new Error('test error');

mongoose.Promise = global.Promise;
mongoose.set('strictQuery', false)

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
}

if(process.env.NODE_ENV !== 'test') {
  prodConnection();
}

const app = express();
if(process.env.DEBUG) app.use((req,res,next)=>{console.log(req.url); next();});
app.use(session({
  secret: 'SECRET',
  resave: true,
  saveUninitialized: true
}));
app.use('/whoami',checkJwt, (req,res)=>res.json(req.user))
app.use('/version', require('./routes/version.route'));
app.use(bodyParser.json({limit: '50mb', type: 'application/json'})); // default is 100kb
app.use(cors());
app.use(passport.initialize());
app.use(require('cookie-parser')('big secret'));

app.use('/user', userRoute);
if(process.env.FUDGE) {
  console.log('ADD FUDGE VERIFICATION ENDPOINT');
  app.get('/user/fudgeVerification/:username', (req,res,next)=>{
    console.log(req.query);
    const User = require('./models/user');
    User.findOneAndUpdate(
      {username: req.params.username},
      {$set: {status: 'Active'}}).then(
        u => {logger.info(u);           res.json(u)},
        e => {logger.error(e.stack);    res.json(e)},
      );
  });
}

app.use(checkJwt);
app.use(require('express-status-monitor')());
app.use('/story', storyRoute);
app.use('/teacherCode', teacherCodeRoute);
app.use('/classroom', classroomRoute);
app.use('/chatbot', chatbotRoute);
app.use('/engagement', engagementRoute);
app.use('/stats', statsRoute);
app.use('/profile', profileRoute);
app.use('/prompt', promptRoute);
app.use('/messages', messageRoute);
app.use('/gramadoir', expressQueue({activeLimit: 10, queuedLimit: -1}), gramadoirLogRoute);
app.use('/recordings', recordingRoute);
app.use('/nlp', nlpRoute);



app.use('/proxy', expressQueue({activeLimit: 2, queuedLimit: -1}), async (req,res,next)=>{
  function allowUrl(url) {
    const allowedUrls = /^https:\/\/phoneticsrv3.lcs.tcd.ie\/nemo\/synthesise|https:\/\/www.abair.ie\/api2\/synthesise|https:\/\/www.teanglann.ie|https:\/\/cadhan.com\/api\/gaelspell\/1.0/;
    return !! allowedUrls.exec(url);
  }
  if(!allowUrl(req.body.url)) return res.status(400).json('illegal url');
  const proxyRes = await axios.get(req.body.url).then(ok=>({ok}),err=>({err}));
  if(proxyRes.err) {
    console.error(proxyRes);
    return res.status(+proxyRes.err.status || +proxyRes.err.response.status || 500).json(proxyRes.err);
  }
  res.json(proxyRes.ok.data);
});

app.use('/synthesis', synthesisRoute);

app.use('/log', require('./routes/log.route'));

const port = process.env.PORT || 4000;

app.use(errorHandler);

// We don't want to call app.listen while testing
// See: https://github.com/visionmedia/supertest/issues/568#issuecomment-575994602
if (!(process.env.NODE_ENV === 'test')) {
  const server = app.listen(port, function(){
      logger.info('Listening on port ' + port);
  });
}

module.exports = app;
