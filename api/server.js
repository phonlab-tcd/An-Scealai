const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    mongoose = require('mongoose'),
    config = require('./DB'),
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

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
    () => {console.log('Database is connected');},
    (err) => { console.log('Can not connect to the database'+ err)}
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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// [SH] Catch unauthorised errors
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

const server = app.listen(port, function(){
    console.log('Listening on port ' + port);
});

module.exports = app;
