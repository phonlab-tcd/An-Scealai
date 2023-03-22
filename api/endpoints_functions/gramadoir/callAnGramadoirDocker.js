const { exec } = require('child_process');
const NodeCache = require("node-cache");

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
    if (true) {
      // get errors from An Gramadoir
      //const gramadoirRes = exec(`docker exec gramadoir gramadoir teanga=en teacs='${req.params["teacs"]}'`).toString();
      exec(`docker exec gramadoir gramadoir teanga=en teacs='${req.params["teacs"]}'`, (error, stdout, stderr) => {
        if (error) {
            return res.json(error);
        }
        let test = stdout;
        console.log(JSON.parse(test));
        let test2 = JSON.parse(stdout);
        console.log(test2)
        return res.json()
 

       });
      //console.log(gramadoirRes)
      //const errors = JSON.parse(gramadoirRes);

      // if errors are found, store them in cache and return
    //   if (errors && errors.length > 0) {
    //     cache.set(req.params["teacs"], errors, 300);
    //     return res.json(errors);
    //   }
      return res.json([]);
    }
    // return errors stored in cache
    res.status(200).send(cachedErrors);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

module.exports = { callAnGramadoirDocker };
