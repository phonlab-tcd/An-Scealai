const express = require('express');

function makeEndpoints(mappings) {
    const routes = express.Router();

    for (const httpMethod of Object.keys(mappings)) {
        for (const [endpoint, func] of Object.entries(mappings[httpMethod])) {
            routes.route(endpoint)[httpMethod](async (req, res, next) => {
                try {
                    await func(req, res);
                } catch (error) {
                    next(error);
                }
            });
        }
    }

    return routes;
}

module.exports = makeEndpoints;