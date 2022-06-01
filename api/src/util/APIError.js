class APIError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

class API400Error extends APIError {
    constructor(message) {
        super(message, 400);
    }
}

class API404Error extends APIError {
    constructor(message) {
        super(message, 404);
    }
}

class API500Error extends APIError {
    constructor(message) {
        super(message, 500);
    }
}

module.exports = {APIError, API400Error, API404Error, API500Error};
