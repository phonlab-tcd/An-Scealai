const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    mongoose = require('mongoose'),
    config = require('./DB'),
    logger = require('./logger'),
    passport = require('passport');

require('./config/passport');

const storyRoute = require('./routes/story.route');
const userRoute = require('./routes/user.route');
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

const errorHandler = require('./utils/errorHandler');

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.connect(config.DB, { useNewUrlParser: true, useUnifiedTopology: true}).then(
    () => {logger.info('Database is connected');},
    (err) => {logger.error('Cannot connect to the database. ',err)}
);

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());

app.use('/story', storyRoute);
app.use('/user', userRoute);
app.use('/teacherCode', teacherCodeRoute);
app.use('/classroom', classroomRoute);
app.use('/Chatbot', chatbotRoute);
app.use('/engagement', engagementRoute);
app.use('/stats', statsRoute);
app.use('/album', albumRoute);
app.use('/profile', profileRoute);
app.use('/messages', messageRoute);
app.use('/studentStats', studentStatsRoute);
app.use('/recordings', recordingRoute);

const port = process.env.PORT || 4000;

app.listen(port, function(){
    logger.info('Listening on port ' + port);
});
app.use(errorHandler);

module.exports = app;
