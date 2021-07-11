
var chai = require('chai');
var assertArrays = require('chai-arrays');
var expect = chai.expect;
chai.use(assertArrays);
var request = require("request");


describe('API Server', () => {
  describe('Story Routes', () => {
    describe('/story/getStoryById/:id', () => {
      const url123 = `http://localhost:4000/story/getStoryById/123`;
      it('should search the database for a story with id 123', function(done) {
        request({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json' 
          },
          uri: url123
        }, function(error, response, body) {
          expect(response.statusCode).to.be.ok;
          expect(404).to.equal(response.statusCode);
          done();
        });
      });

      const url2 = `http://localhost:4000/story/getStoryById/60d9d0e0ab6f246248fc794e`;
      it('should search the database for a story with id 60d9d0e0ab6f246248fc794e',
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

    describe('/story/:author', function() {
      const urlNeimhin = 'http://localhost:4000/story/neimhin';
      it('should find all of neimhin\'s stories', function(done) {
        request({
          headers: {
            'Content-Type': 'application/json',
          },
          uri: urlNeimhin
        }, function(error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        });
      });

      let url = 'http://localhost:4000/story/notauser';
      it('should not find any stories for notauser', function(done) {
        request({
          headers: {
            'Content-Type': 'application/json'
          },
          uri: url
        }, function(error, response, body) {
          expect(response.body).to.equal('{}');
          done();
        });
      });
    });
  });
});
