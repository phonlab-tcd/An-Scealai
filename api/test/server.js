
var chai = require('chai');
var assertArrays = require('chai-arrays');
var expect = chai.expect;
chai.use(assertArrays);
var request = require("request");


describe("API Server", () => {
  describe("Story Routes", () => {
    describe("/story/getStoryById/:id", () => {
      let url123 = `http://localhost:4000/story/getStoryById/123`;
      it("should search the database for a story with id 123", function(done){
        request({
          headers: {
            'Content-Type': 'application/json' 
          },
          uri: url123
        }, function(error, response, body) {
          console.log(response.statusCode);
          console.log(body);
          expect(response.statusCode).to.equal(404);
          done();
        });
      });

      let url2 = `http://localhost:4000/story/getStoryById/41492094-7c40-4ca8-8289-ab3894b66b61`;
      it("should search the database for a story with id 41492094-7c40-4ca8-8289-ab3894b66b61",
        function(done){
          request(
            {
              headers: {
                'Content-Type': 'application/json' 
              },
              uri: url2
            }, function(error, response, body) {
              console.log(response.statusCode);
              console.log(body);
              expect(response.statusCode).to.equal(200);
              done();
            }
          );
        }
      );
    });

    describe("/story/:author", function() {
      let urlNeimhin = "http://localhost:4000/story/neimhin";
      it("should find all of neimhin's stories", function(done) {
        request({
          headers: {
            'Content-Type': 'application/json'
          },
          uri: urlNeimhin
        }, function(error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        });
      });

      let url = "http://localhost:4000/story/notauser";
      it("should not find any stories for notauser", function(done) {
        request({
          headers: {
            'Content-Type': 'application/json'
          },
          uri: url
        }, function(error, response, body) {
          expect(response.statusCode).to.equal(404);
          done();
        });
      });
    });
    
    describe("GET /story/synthesise/:id", () => {
      it("should respond with 404 for the non-existent id: 000", (done) => {
        request({
          headers: {
            'Content-Type': 'application/json',
          },
          uri: "http://localhost:4000/story/synthesise/:id",
          method: "GET",
        }, (err, response, body) => {
          console.log(response.statusCode);
          expect(response.statusCode).equal(404);
          done();
        });


      });
    });
  });
});
