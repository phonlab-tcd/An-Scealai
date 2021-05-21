

When logging, these additional fields can be added to the log object where apllicable:

```javascript
logger.log({
  level: "info", // or "error", "warn", "debug", etc.
  message: "message",
  responsecode: 400,
  endpoint: "endpoint",
  userid: "userid",
});
```

## WINSTON LOGGING

`logger.js` gives an example of how logging can be done through different
transports and at different levels.

### Transports

An instance of a wintson logger object can have multiple 'transports.'
This allows us to send our log messages to multiple locations with one call.
If the logger has a Console() tranport the log messages will be logged to console.
If there is also a File() transport then each message will *also* be sent to the file specified in the File() transport.

## Loggig Levels

The `logger.js` example logs all messages to `logs/combined.log` and only errors
to `logs/error.log`.
