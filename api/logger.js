const winston = require('winston');
const path = require('path');
const mongodb = require('mongodb');
// var stackify = require('stackify-logger');
// logger.error is console.error until the winston logger is created
let logger = {error: console.error};

// TODO: I'm not sure if this line should be included
process.on('uncaughtException', (err) => {
  console.error(err);
});

const timeFormat = 'DD-MM-YYYY HH:mm:ss';

const errorFile = path.join(__dirname, 'logs/error.log');
const combinedFile = path.join(__dirname, 'logs/combined.log');

const consoleFormat = winston.format.printf(
    ({level, message, timestamp, ...metadata}) => {
      // TODO log the rest parameters in metadata
      const msg = `${timestamp} [${level}] : ${JSON.stringify(message)}`;
      return msg;
    });

// Create our logger object
let transports = [
  // This transport lets us log to the console
  new winston.transports.Console({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({
          format: timeFormat,
        }),
        winston.format.errors({stack: true}),
        consoleFormat,
    ),
    handleExceptions: true,
  }),
  // This transport logs to the error file
  new winston.transports.File({
    format: winston.format.combine(
        winston.format.timestamp({
          format: timeFormat,
        }),
        winston.format.errors({stack: true}),
        winston.format.json(),
        // enumerateErrorFormat()
    ),
    filename: errorFile,
    handleExceptions: true,
    level: 'error',
  }),
  // This transport should be were everything gets sent
  new winston.transports.File({
    format: winston.format.combine(
        winston.format.timestamp({
          format: timeFormat,
        }),
        winston.format.errors({stack: true}),
        winston.format.json(),
    ),
    filename: combinedFile,
  }),
];
if(process.env.NODE_ENV === 'test') {
  transports = [transports[0]];
}
const levels = {
    emerg: 0,
    alert: 1,
    crit: 2,
    error: 3,
    warning: 4,
    notice: 5,
    info: 6,
    debug: 7,
  };
logger = winston.createLogger({
  transports,
  levels,
});

require('winston-mongodb');
const mongoTransport = new winston.transports.MongoDB({
  level: 'info', // info is the default
  db: require('./utils/dbUrl'),
  collection: 'log', // default is 'log'
  options: { // modified version of default
    poolSize: 2, // default
    useNewUrlParser: true, // default
    useUnifiedTopology: true, // not default
  },
});
logger.add(mongoTransport);

// EXAMPLE LOGGER USAGE
// logger.emerg('this is just a test');
// logger.alert('this is just a test');
// logger.crit('this is just a test');
// logger.error('this is just a test');
// logger.warning('this is just a test');
// logger.notice('this is just a test');
// logger.info('this is just a test');
// logger.debug('this is just a test');
// throw new Error('test error');

module.exports = logger;
