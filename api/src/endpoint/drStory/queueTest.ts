const DigitalReaderStory = require('../../models/drStory');
const {API500Error} = require('../../utils/APIError');

/**
 * Creates a new story document on the DB.
 * @param {Object} req body: Story object
 * @param {Object} res
 * @return {Promise} id: the id of the created story
 */

function test (requestBody:any) {
  return new Promise(
    (resolve, reject) => {
      console.log(requestBody);
      resolve('test resolution!');
  })
}