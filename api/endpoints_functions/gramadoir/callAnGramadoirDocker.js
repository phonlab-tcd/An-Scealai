const { exec } = require("child_process");
const NodeCache = require("node-cache");

// set the cache for storing grammar error responses
const cache = new NodeCache({ stdTTL: 600 });

/**
 * Send request to An Gramadoir for request input
 * Returns any error data found
 * @param {Object} req input text to check
 * @param {Object} res
 * @return {Promise} object of errors
 */
async function callAnGramadoirDocker(req, res) {
  try {
    // try to get the errors from the cache if sentence already requested
    let cachedErrors = cache.get(req.params["teacs"]);

    // if errors do not exist in the cache, request them and then set the cache
    if (cachedErrors == null) {
      execShellCommand(`docker exec gramadoir gramadoir teanga=en teacs='${req.params["teacs"]}'`).then(
        (errorRes) => {
          cache.set(req.params["teacs"], JSON.parse(errorRes), 300);
          return res.json(JSON.parse(errorRes));
        },
        (error) => {
          return res.json(error);
        }
      );
    }
    else {
      // return errors stored in cache
      res.status(200).send(cachedErrors);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

// Call the gramadoir file to get errors using command line
function execShellCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
        return reject(error);
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}

module.exports = { callAnGramadoirDocker };
