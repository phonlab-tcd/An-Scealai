"use strict";
var chai = require('chai');
var assertArrays = require('chai-arrays');
var expect = chai.expect;
chai.use(assertArrays);
var request = require("request");
describe("API Server", function () {
    describe("Story Routes", function () {
        describe("/story/getStoryById/:id", function () {
            var url123 = "http://localhost:4000/story/getStoryById/123";
            it("should search the database for a story with id 123", function (done) {
                request({
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    uri: url123
                }, function (error, response, body) {
                    console.log(response.statusCode);
                    console.log(body);
                    expect(response.statusCode).to.equal(404);
                    done();
                });
            });
            var url2 = "http://localhost:4000/story/getStoryById/41492094-7c40-4ca8-8289-ab3894b66b61";
            it("should search the database for a story with id 41492094-7c40-4ca8-8289-ab3894b66b61", function (done) {
                request({
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    uri: url2
                }, function (error, response, body) {
                    console.log(response.statusCode);
                    console.log(body);
                    expect(response.statusCode).to.equal(200);
                    done();
                });
            });
        });
        describe("/story/:author", function () {
            var urlNeimhin = "http://localhost:4000/story/neimhin";
            it("should find all of neimhin's stories", function (done) {
                request({
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    uri: urlNeimhin
                }, function (error, response, body) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });
            });
            var url = "http://localhost:4000/story/notauser";
            it("should not find any stories for notauser", function (done) {
                request({
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    uri: url
                }, function (error, response, body) {
                    expect(response.statusCode).to.equal(404);
                    done();
                });
            });
        });
    });
});
