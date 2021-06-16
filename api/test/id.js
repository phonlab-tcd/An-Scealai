
const request = require('request');
const chai = require('chai');


const baseurl = 'http://localhost:400';

describe("Backend use of `id` and `_id`", () => {
  const author = "neimhin";

  describe("GET /story/neimhin", () => {

    it("should get at least 1 story whose author is 'neimhin'", done => {

      request({
        headers: {
          'Content-Type': 'application/json',
        },
        uri: `${baseurl}/story/${author}`,
        method: 'GET',
      }, (err, res, body) => {
        chai.expect(err).equal(null);
        console.log(body);
      });
    });
  });

});
