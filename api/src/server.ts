import { Logger } from 'winston';
import Express from 'express';
import { RequestHandler } from 'express';
const express           = require('express');
const bodyParser        = require('body-parser');
const cors              = require('cors');
const mongoose          = require('mongoose');
const passport          = require('passport');

const logger: Logger    = require('./util/logger');
const errorHandler      = require('./util/errorHandler');
const dbURL             = require('./util/dbUrl');
                          require('./config/passport');

const storyRoute        = require('./route/story.route');
const userRoute         = require('./route/user.route');
const teacherCodeRoute  = require('./route/teacherCode.route');
const classroomRoute    = require('./route/classroom.route');
const chatbotRoute      = require('./route/chatbot.route');
const engagementRoute   = require('./route/engagement.route');
const statsRoute        = require('./route/stats.route');
const albumRoute        = require('./route/album.route');
const profileRoute      = require('./route/profile.route');
const messageRoute      = require('./route/messages.route');
const studentStatsRoute = require('./route/studentStats.route');
const recordingRoute    = require('./route/recording.route');
const mailRoute         = require('./route/send_mail.route');
const gramadoirLogRoute = require('./route/gramadoir_log.route');
const synthesisRoute    = require('./route/synthesis.route');
const auth              = require('./util/authMiddleware');
const whoami            = require('./endpoint/user/whoami');

// use this to test where uncaughtExceptions get logged
// throw new Error('test error');

async function connectDb() {
  logger.info('DB url: ' + dbURL);
  mongoose.Promise = global.Promise;
  mongoose.set('useFindAndModify', false);
  const opts = {
    autoIndex: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: process.env.TIMEOUT,
  };
  await mongoose.connect(dbURL, opts);
  logger.info(`connected ${dbURL}`);
}

if(process.env.NODE_ENV !== 'test')
  connectDb();

const app = express();
app.use('/version', require('./route/version.route'));
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());

app.use('/story', auth.jwtmw, storyRoute);
app.use('/user', userRoute);
app.use('/user/whoami', auth.jwtmw, whoami);
if(process.env.FUDGE) {
  console.log('ADD FUDGE VERIFICATION ENDPOINT');
  const fugdeVerificationController: RequestHandler = 
    async function (req, res) {
      const User = require('./model/user');
      const username = req.params.username;
      const query = {username};
      const user = await User.findOne(query);
      if(!user) return res.status(404).json();
      const link = await user.generateActivationLink();
      console.log(link);
      res.json(link);
  };
  app.get('/user/fudgeVerification/:username',fugdeVerificationController);
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
app.use('/synthesis', synthesisRoute);

app.use('/util/mail', mailRoute);
app.use('/log', require('./route/log.route'));

const port = process.env.PORT || 4000;

app.use(errorHandler);

if(process.env.TEST !== "1") {
  app.listen(port, function(){
      logger.info('Listening on port ' + port);
  });
}

module.exports = app;
