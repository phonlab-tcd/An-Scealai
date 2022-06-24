import type { HttpMethod } from './httpMethod';
import type { RequestHandler } from 'express';
import express from 'express';
// This function takes in mappings from endpoint strings to functions for those
// endpoints and uses them to create an express Router that's ready to be used
// in server.js. This wraps the endpoint functions in a try / catch
// block so that unexpected runtime errors won't bring the server down. 
type HandlerMap= {
  [K in string]: (...args: Parameters<RequestHandler>)=>Promise<any>;
}
export type RouterMethodMaps = {
  [K in HttpMethod]: HandlerMap;
};

function makeEndpoints(mappings: RouterMethodMaps) {
  const router = express.Router();
  for (const [httpMethod, routerMap] of Object.entries(mappings)) {
    for (const [endpoint, func] of Object.entries(routerMap)) {
      const triedHandler: RequestHandler = async (req, res, next) => {
        try {
          await func(req, res, next);
        } catch (error) {
          console.error(httpMethod, endpoint, func, error);
          next(error);
        }
      }
      router[httpMethod](endpoint,triedHandler);
    }
  }

  return router;
}

module.exports = makeEndpoints;
