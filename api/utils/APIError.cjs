/**
 * Status code semantics:
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 */

class APIError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

// Bad request 
class API400Error extends APIError {
    constructor(message) {
        super(message, 400);
    }
}

// Not found
class API404Error extends APIError {
    constructor(message) {
        super(message, 404);
    }
}

// Internal server error
class API500Error extends APIError {
    constructor(message) {
        super(message, 500);
    }
}

module.exports = {APIError, API400Error, API404Error, API500Error};
