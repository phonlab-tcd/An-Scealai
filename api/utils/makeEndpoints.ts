const express = require('express');

/**
 * This function takes in mappings from endpoint strings to functions for those
 * endpoints and uses them to create an express Router that's ready to be used
 * in server.js. This wraps the endpoint functions in a try / catch
 * block so that unexpected runtime errors won't bring the server down. 
 * 
 * @param mappings - an object containing mappings from endpoint strings to
 *  endpoint functions. e.g.:
        mappings = {
            get: {
                'some/endpoint/string' : endpointFunction
            },
            ...
        }
 * @return - an express Router object containing all the endpoints passed in mappings
 */
function makeEndpoints(mappings) {
  const routes = express.Router();
  console.dir(mappings);

  for (const httpMethod of Object.keys(mappings)) {
    for (const [endpoint, func] of Object.entries(mappings[httpMethod])) {
      routes.route(endpoint)[httpMethod](async (req, res, next) => {
        try {

          // @ts-expect-error
          await func(req, res);
        } catch (error) {
          console.log(httpMethod, endpoint, func);
          next(error);
        }
      });
    }
  }

  return routes;
}

export = makeEndpoints;
