import { transport    } from 'winston';
import { createLogger } from 'winston';
import path    from 'path';
import winston from 'winston';
const dbUrl: string  = require('./dbUrl');

// TODO: I'm not sure if this line should be included
process.on('uncaughtException', (err) => {
  // logger.error({ title: "UNCAUGHT EXCEPTION", error: err } );
  console.error('uncaughtException', err);
});

const timeFormat = 'DD-MM-YYYY HH:mm:ss';

const errorFile    = path.join(__dirname, '../../logs/error.log');
const combinedFile = path.join(__dirname, '../../logs/combined.log');

const consoleFormat = winston.format.printf(
    ({level, message, timestamp, ...metadata}) => {
      // TODO log the rest parameters in metadata
      const msg = `${timestamp} [${level}] : ${JSON.stringify(message)}`;
      return msg;
    });

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

// Log to console 
const consoleTransport: transport = new winston.transports.Console({
  format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({
        format: timeFormat,
      }),
      winston.format.errors({stack: true}),
      consoleFormat,
  ),
  handleExceptions: true,
});

// Log level error and above to errorsFile 
const combinedFileTransport: transport = new winston.transports.File({
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
});

// Log everything to combinedFile 
const errorsFileTransport: transport = new winston.transports.File({
  format: winston.format.combine(
      winston.format.timestamp({
        format: timeFormat,
      }),
      winston.format.errors({stack: true}),
      winston.format.json(),
  ),
  filename: combinedFile,
});


// Log to `log` collection in database
import 'winston-mongodb';
const mongoTransport: transport = new winston.transports.MongoDB({
  db: dbUrl,
  options: {
    useUnifiedTopology: true, // not default
  },
});

const transports: transport[] = [
  consoleTransport,
  combinedFileTransport,
  errorsFileTransport,
  mongoTransport,
];

// Create our logger object
const logger = createLogger({transports,levels});

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
