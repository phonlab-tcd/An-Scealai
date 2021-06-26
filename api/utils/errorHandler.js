const APIError = require('./APIError');

function errorHandler(err, req, res, next) {
    if (!(err instanceof APIError)) {
        return res.send(err);
    }
    if (err.status === 500) {
        // Notify us
    }
    // Handle other status codes in whatever ways we want
    return res.status(err.status).json(err.message);
}

module.exports = errorHandler;