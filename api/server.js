const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./DB');
const logger = require('./logger');
const passport = require('passport');
const errorHandler = require('./utils/errorHandler');
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
const mailRoute = require('./routes/send_mail.route');

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
// use the URL for the test DB if it has been set, otherwise use the normal DB.
const dbURL = process.env.TEST_MONGO_URL || (config.DB_URL_PREFIX + config.DB_NAME);
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true}).then(
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
app.use('/mail', mailRoute);

const port = process.env.PORT || 4000;

app.use(errorHandler);

const server = app.listen(port, function(){
    logger.info('Listening on port ' + port);
});

module.exports = app;
