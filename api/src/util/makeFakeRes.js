/**
 * Makes a mock express Response object to be used for testing endpoint
 * functions. The fake response returned can be passed into an endpoint
 * function where its res.status and res.json will be set. These properties
 * can then be checked by tests, e.g.
 * 
 *      const fakeRes = makeFakeRes();
 *      const res = someEndpointFunction(fakeReq, fakeRes);
 *      expect(res.status).toBe(200);
 *      ...
 * 
 * @returns - fake express Response object
 */
const makeFakeRes = () => {
    const res = {};
    res.status = (code) => {
        res.statusCode = code;
        return res;
    }
    res.json = (object) => {
        res.jsonBody = object;
        return res;
    }
    return res;
}

// shorthand json parsing util function
const json = (obj) => JSON.parse(JSON.stringify(obj));

module.exports = { makeFakeRes, json};
