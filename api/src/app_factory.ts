import { RequestHandler } from 'express';
function build_app() {
  const express           = require('express');
  const bodyParser        = require('body-parser');
  const cors              = require('cors');
  const passport          = require('passport');
                            require('./config/passport');
  
  const errorHandler      = require('./util/errorHandler');
  
  const versionRoute      = require('./route/version.route');
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
  const gramadoirLogRoute = require('./route/gramadoir.route');
  const synthesisRoute    = require('./route/synthesis.route');
  const auth              = require('./util/authMiddleware');
  const whoami            = require('./endpoint/user/whoami');

  const app = express();
  app.use('/version', versionRoute);
  app.use(bodyParser.json());
  app.use(cors());
  if(process.env.FUDGE) {
    console.log('ADD FUDGE VERIFICATION ENDPOINT');
    const handler: RequestHandler = (req,res)=>{
      console.log(req.query);
      const User = require('./model/user');
      const logger = require('./util/logger');
      User.findOneAndUpdate(
        {username: req.params.username},
        {$set: {status: 'Active'}}).then(
          (u:any) => {logger.info(u);           res.json(u)},
          (e:any) => {logger.error(e.stack);    res.json(e)},
        );
    }
    app.get('/user/fudgeVerification/:username', handler);
  }
  app.use(passport.initialize());
  
  app.use('/user', userRoute);
  app.use(auth.jwtmw);
  app.use('/story', storyRoute);
  app.use('/user/whoami', whoami);
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
  
  app.use(errorHandler);
  return app;
}

module.exports = build_app;
