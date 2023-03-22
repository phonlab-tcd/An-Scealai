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
  const url = "https://phoneticsrv3.lcs.tcd.ie/gramadoir/api-gramadoir-1.0.pl";

  /* encode URI params */
  function encodeParams(text) {
    return `teacs=${encodeURIComponent(text)}&teanga=en`;
  }

  const options = {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
  };

  try {
    // try to get the errors from the cache if sentence already requested
    let cachedErrors = cache.get(req.params["teacs"]);

    // if errors do not exist in the cache, request them and then set the cache
    if (true) {
      // get errors from An Gramadoir
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
    }
    // return errors stored in cache
    res.status(200).send(cachedErrors);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

module.exports = { callAnGramadoir };