
var chai = require('chai');
var assertArrays = require('chai-arrays');
var expect = chai.expect;
chai.use(assertArrays);
var request = require("request");


describe("API Server", () => {
  describe("Story Routes", () => {
    describe("/story/getStoriesForClassroom/:author/:date", () => {

      let url = `http://localhost:4000/story/getStoriesForClassroom/notAnAuthor/notADate`;
      it('should respond with statusCode 400 since notADate cannot be cast to a date. url: ' + url, function(done){
        request({
          headers: {
            'Content-Type': 'application/json' 
          },
          uri: url
        }, function(error, response, body) {
          console.dir(response.statusCode);
          console.dir(body);
          expect(response.statusCode).to.equal(400);
          done();
        });
      });

      // db.story.find({
      //  author: "neimhin",
      //  date: {$gte: ISODate("2020-07-11T21:00:00.139Z")}})
      // // gives 8 documents
      url = `http://localhost:4000/story/getStoriesForClassroom/neimhin/${encodeURIComponent('2020-07-11T21:00:00.139Z')}`;
      it('should respond with at least one story by neimhin ' +
        'url: ' + url, function(done) {
        request({
          headers: {
            'Content-Type': 'application/json',
          },
          uri: url,
        }, function(error, response, body) {
          console.dir(response.statusCode);
          console.dir(body);
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(body).length).to.be.greaterThan(1);
          done();
        });
      });
 
      url = `http://localhost:4000/story/getStoriesForClassroom/notAnAuthor/${new Date()}`;
      it(
          'should respond with an empty list ' +
          'since there have been no stories created after right now. ' +
          'url: ' + url,
          function(done) {
            request({
              headers: {
                'Content-Type': 'application/json',
              },
              uri: url,
            }, function(error, response, body) {
              // expect body to be the string '[]'
              expect(body.match(/[]/));
              done();
            });
          });
    });

    describe("/story/getStoryById/:id", () => {
      let url123 = `http://localhost:4000/story/getStoryById/123`;
      it("should search the database for a story with id 123", function(done){
        request({
          headers: {
            'Content-Type': 'application/json' 
          },
          uri: url123
        }, function(error, response, body) {
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
  });
});
