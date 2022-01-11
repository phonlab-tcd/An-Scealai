# How to make a new endpoint
### Implementing the endpoint
Endpoints consist of:
* an **endpoint function**: this is a javascript function of the form `f(req, res)`, where `req` and `res` are express [Request](https://expressjs.com/en/api.html#req) and [Response](https://expressjs.com/en/api.html#res) objects. It lives in `api > endpointsFunctions > ...`, and implements whatever functionality we want from the endpoint, e.g. [getting a story by id](https://github.com/OisinNolan/An-Scealai/blob/119cbcdc7ff25c4d6cf069663f5bc0297021ef51/api/endpointsFunctions/story/getStoryById.js#L4).
* a **route**: this is a URI string that identifies the endpoint. It lives in `api > routes > *.route.js`. We point specify the route using the [makeEndpoints()](https://github.com/OisinNolan/An-Scealai/blob/119cbcdc7ff25c4d6cf069663f5bc0297021ef51/api/utils/makeEndpoints.js#L19) function. See an example of this being used in [the story routes file](https://github.com/OisinNolan/An-Scealai/blob/119cbcdc7ff25c4d6cf069663f5bc0297021ef51/api/routes/story.route.js#L50).

In order to make a new endpoint, first implement the endpoint function, and then specify it's route in the appropriate `.route.js` file. The route files correspond to the models that their endpoints operate on.

The easiest way to go about this is to _copy and edit an existing endpoint_. You'll want to find the existing endpoint that is most similar to the one you want to implement.

### Testing
We currently have two ways to test our endpoints:
* **function-level tests**: these can be used to test that the endpoint function logic is working correctly. We can use [mock requests](https://github.com/OisinNolan/An-Scealai/blob/119cbcdc7ff25c4d6cf069663f5bc0297021ef51/api/endpointsFunctions/story/getStoryById.test.js#L9) and [mock responses](https://github.com/OisinNolan/An-Scealai/blob/119cbcdc7ff25c4d6cf069663f5bc0297021ef51/api/endpointsFunctions/story/getStoryById.test.js#L14) to provide the possible input cases to the endpoint function, and ensure that they return the appropriate response, or throw the expected error. We use [mockingoose](https://www.npmjs.com/package/mockingoose) to mock responses from mongoose functions like `.find()` and `.update()`. These tests live alongside endpoint functions in `api > endpointsFunctions > * > *.test.js`. An example is [`getStoryById.test.js`](https://github.com/OisinNolan/An-Scealai/blob/master/api/endpointsFunctions/story/getStoryById.test.js).
* **end-to-end tests**: these are for testing routes end-to-end. Here we make a fresh database which we populate with _real_ documents to check that our endpoints work on an API level. We can check for a number of cases that the response status and body contain what we expect them to. We use [supertest](https://www.npmjs.com/package/supertest) to mock the requests. These live alongside route files in `api > routes > *.route.test.js`. An example is [`story.route.test.js`](https://github.com/OisinNolan/An-Scealai/blob/master/api/routes/story.route.test.js).

To **run tests** use `npm test` in the `/api` directory.
