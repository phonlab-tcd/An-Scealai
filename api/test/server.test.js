var request = require("request");

describe("API Server", () => {
  describe("Story Routes", () => {
    describe("/version", () => {
      let url = `http://localhost:4000/version`;
      it(`should send package.json which should have a valid 'version' field`, (done) => {
        request({
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'GET', 
          uri: url,
        }, (error, res, body) => {
          const parsed = JSON.parse(body);
          console.log(Object.keys(parsed));
          expect(parsed.version instanceof String);
          done();
        });
      });
    });
    describe("/story/getStoryById/:id", () => {
      let url123 = `http://localhost:4000/story/getStoryById/123`;
      it("should search the database for a story with id 123", () => {
        request({
          headers: {
            'Content-Type': 'application/json' 
          },
          uri: url123
        }, function(error, response, body) {
          console.log(response.statusCode);
          console.log(body);
          expect(response.statusCode).toBe(404);
        });
      });

      let url2 = `http://localhost:4000/story/getStoryById/41492094-7c40-4ca8-8289-ab3894b66b61`;
      it("should search the database for a story with id 41492094-7c40-4ca8-8289-ab3894b66b61",
        () => {
          request(
            {
              headers: {
                'Content-Type': 'application/json' 
              },
              uri: url2
            }, function(error, response, body) {
              console.log(response.statusCode);
              console.log(body);
              expect(response.statusCode).toBe(200);
            }
          );
        }
      );
    });

    describe("/story/:author", function() {
      let urlNeimhin = "http://localhost:4000/story/neimhin";
      it("should find all of neimhin's stories", () => {
        request({
          headers: {
            'Content-Type': 'application/json'
          },
          uri: urlNeimhin
        }, function(error, response, body) {
          expect(response.statusCode).toBe(200);
        });
      });

      let url = "http://localhost:4000/story/notauser";
      it("should not find any stories for notauser", () => {
        request({
          headers: {
            'Content-Type': 'application/json'
          },
          uri: url
        }, function(error, response, body) {
          expect(response.statusCode).toBe(404);
        });
      });
    });
  });
});
