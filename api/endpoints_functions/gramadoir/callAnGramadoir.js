const axios = require("axios");
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
  const url = "https://www.abair.ie/gramadoir/" + encodeURIComponent(req.params["teacs"]);

  try {
    // try to get the errors from the cache if sentence already requested
    let cachedErrors = cache.get(req.params["teacs"]);
    if (cachedErrors) {
          // return errors stored in cache
          return res.status(200).send(cachedErrors);
    }

    // get errors from An Gramadoir
    // @ts-ignore
    const gramadoirRes = await axios.post(url, encodeParams(req.params["teacs"]), options).then(
      (ok) => ({ ok }),
      (err) => ({ err })
    );

    // if response ok, set cache and return errors
    if ("ok" in gramadoirRes) {
      cache.set(req.params["teacs"], gramadoirRes.ok.data, 300);
      return res.json(gramadoirRes.ok.data);
    }
    // otherwise return error
    console.error(gramadoirRes.err.data);
    return res.json(gramadoirRes.err.data);

  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

module.exports = { callAnGramadoir };
