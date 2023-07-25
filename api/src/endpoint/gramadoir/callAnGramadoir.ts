import axios from "axios";
import result from "../../utils/result";
import { Request, Response } from "express";
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 600 });

/**
 * Send request to An Gramadoir for request input
 * Returns any error data found
 * @param {Object} req input text to check
 * @param {Object} res
 * @return {Promise} object of errors
 */
async function callAnGramadoir(req, res) {
if(!process.env.GRAMADOIR_URL) process.env.GRAMADOIR_URL = "https://gramadoir.abair.ie/";

export async function callAnGramadoir(req: Request, res: Response) {
  const url = process.env.GRAMADOIR_URL + encodeURIComponent(req.params["teacs"]);

  try {
    // try to get the errors from the cache if sentence already requested
    let cachedErrors = cache.get(req.params["teacs"]);
    if (cachedErrors) {
      console.log("cached gramadoir", cachedErrors);
      // return errors stored in cache
      return res.status(200).send(cachedErrors);
    }

    // get errors from An Gramadoir
    const gramadoirRes = await result( axios.get(url) );

    console.log(gramadoirRes);

    // if response ok, set cache and return errors
    if ("ok" in gramadoirRes) {
      cache.set(req.params["teacs"], gramadoirRes.ok.data, 300);
      return res.json(gramadoirRes.ok.data);
    }
    // otherwise return error
    console.error(gramadoirRes.err.data);
    return res.json(gramadoirRes.err.data);

  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}