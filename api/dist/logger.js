"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var logger = __importStar(require("winston"));
var path = require('path');
var mongodb = require('mongodb');
var transports = logger.transports;
// logger.error is console.error until the winston logger is created
// TODO: I'm not sure if this line should be included
process.on('uncaughtException', function (err) {
    logger.error({ title: "UNCAUGHT EXCEPTION", error: err });
    console.dir(err);
});
var errorFile = path.join(__dirname, 'logs/error.log');
var combinedFile = path.join(__dirname, 'logs/combined.log');
var uncaughtExceptionsFile = path.join(__dirname, 'logs/uncaughtExceptions.log');
var enumerateErrorFormat = logger.format(function (info) {
    if (info.message instanceof Error) {
        info.message = Object.assign({
            message: info.message.message,
            stack: info.message.stack,
        }, info.message);
    }
    if (info instanceof Error) {
        return Object.assign({
            message: info.message,
            stack: info.stack,
        }, info);
    }
    return info;
});
var consoleFormat = logger.format.printf(function (_a) {
    var level = _a.level, message = _a.message, timestamp = _a.timestamp, metadata = __rest(_a, ["level", "message", "timestamp"]);
    // TODO log the rest parameters in metadata
    var string_message = JSON.stringify(message);
    var metaDataMsg = '';
    for (var d in metadata) {
        metaDataMsg += JSON.stringify(d) + ' : ';
    }
    metaDataMsg += 'END';
    var msg = timestamp + " [" + level + "] : " + string_message;
    return msg;
});
// Create our logger object
logger.configure({
    format: logger.format.combine(logger.format.timestamp()),
    transports: [
        // This transport lets us log to the console
        new logger.transports.Console({
            format: logger.format.combine(logger.format.colorize(), logger.format.timestamp(), consoleFormat)
        }),
        // This transport logs to the error file
        new logger.transports.File({ filename: errorFile, level: 'error' }),
        // This transport should be were everything gets sent
        new logger.transports.File({ filename: combinedFile }),
    ],
    levels: {
        emerg: 0,
        alert: 1,
        crit: 2,
        error: 3,
        warning: 4,
        notice: 5,
        info: 6,
        debug: 7
    },
    exceptionHandlers: [
        new logger.transports.File({ filename: uncaughtExceptionsFile }),
    ],
});
require('winston-mongodb');
var preconnectedDB = null;
var client = mongodb.MongoClient.connect('mongodb://localhost:27017/an-scealai', { useUnifiedTopology: true, useNewUrlParser: true })
    .then(function (db) {
    var date = new Date();
    var shortDate = date.toLocaleString('en-gb', { weekday: 'short' })
        + date.toLocaleString('en-gb', { month: 'short' }) + date.getDate() + '_' + date.getHours() + ':' + date.getMinutes();
    preconnectedDB = db;
    var mongoTransport;
    mongoTransport = new transports.MongoDB({
        level: "info",
        db: preconnectedDB,
        collection: 'log',
        options: {
            poolSize: 2,
            useNewUrlParser: true,
            // tryReconnect: true // default // not compatible with useUnifiedTopology: ture
            useUnifiedTopology: true, // not default
        }
    });
    logger.add(mongoTransport);
})
    .catch(function (err) {
    logger.error("FAILED TO CONNECT TO MONGODB. MONGODB TRANSPORT WILL NOT BE ADDED.", err.message);
});
// This should be deleted before merging the PR
//logger.emerg("this is just a test");
//logger.alert("this is just a test");
//logger.crit("this is just a test");
//logger.error("this is just a test");
//logger.warning("this is just a test");
//logger.notice("this is just a test");
//logger.info("this is just a test");
//logger.debug("this is just a test");
module.exports = logger;
module.exports = logger;
