const axios = require("axios");

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
  function request(text) {
    return `teacs=${encodeURIComponent(text)}&teanga=en`;
  }

  const options = {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
  };

  const gramadoirRes = await axios.post(url, request(req.params["teacs"]), options).then(
    (ok) => ({ ok }),
    (err) => ({ err })
  );

  if ("ok" in gramadoirRes) {
    return res.json(gramadoirRes.ok.data);
  }
  console.error(gramadoirRes.err.data);
  return res.json(gramadoirRes.err.data);
}

module.exports = { callAnGramadoir };
