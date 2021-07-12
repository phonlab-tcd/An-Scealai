class AbstractCommand {

    makeExecutor(func) {
        return async (req, res, next) => {
            try {
                await func(req, res);
            } catch (error) {
                next(error);
            }
        }
    }

    constructor(callFunction) {
        this.execute = this.makeExecutor(callFunction);
    }
}

module.exports = AbstractCommand;