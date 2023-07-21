import { Router } from "express";
import { wrap } from "module";
import { z } from "zod";

const array_of_functions = z.array(z.function());

function wrap_try_catch(f: Function) {
  return async function(req, res, next) {
    try {
      await f(req,res,next)
    } catch (error) {
      next(error);
    }
  }
}

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
  const routes = Router();
  console.dir(mappings);

  for (const httpMethod of Object.keys(mappings)) {
    for (const [endpoint, func] of Object.entries(mappings[httpMethod])) {

      const funcs = array_of_functions.safeParse(func);
      if(funcs.success) {
        const new_funcs = funcs.data.map(wrap_try_catch)
        routes.route(endpoint)[httpMethod](...new_funcs);
      } else {
        const f = z.function().parse(func);
        routes.route(endpoint)[httpMethod](wrap_try_catch(f));
      }
    }
  }

  return routes;
}

export = makeEndpoints;
