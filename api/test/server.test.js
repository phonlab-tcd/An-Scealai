const axios = require('axios').default;

describe('API Server', () => {
  describe('Story Routes', () => {
    describe('/version', () => {
      const url = `http://localhost:4000/version`;
      it(
          'should send package.json ' +
          'which should have a valid \'version\' field',
          async () => {
            await axios.get(url, {
              headers: {
                'Content-Type': 'application/json',
              },
              method: 'GET',
            }).then(function(response) {
              const semVer =
                response.data
                    .version
                    .split('.')
                    .map((n) => {
                      parseInt(n);
                    });
              console.dir(semVer);
              expect(semVer.length).toBe(3);
              expect(semVer[0] >= 1);
            });
          });
    });

    describe('/story/getStoryById/:id', () => {
      const url123 = `http://localhost:4000/story/getStoryById/123`;
      it('should search the database for a story with id 123',
          async () => {
            await axios.get(url123, {
              headers: {
                'Content-Type': 'application/json',
              },
            }).then(function(response) {
              expect(response.data.status).toBe(404);
            });
          });

      const url2 = `http://localhost:4000/story/getStoryById/41492094-7c40-4ca8-8289-ab3894b66b61`;
      it(
          'should search the database for ' +
          'a story with id 41492094-7c40-4ca8-8289-ab3894b66b61',
          async () => {
            await axios.get(url2, {
              headers: {
                'Content-Type': 'application/json',
              }})
                .then(function(response) {
                  expect(response.data.status).toBe(200);
                });
          });
    });

    describe("/story/:author", function() {
      let urlNeimhin = "http://localhost:4000/story/neimhin";
      it("should find all of neimhin's stories", () => {
        axios.get(urlNeimhin, {
          headers: {
            'Content-Type': 'application/json'
          },
        }).then(function(response) {
          expect(response.status).toBe(200);
        });
      });

      let url = "http://localhost:4000/story/notauser";
      it("should not find any stories for notauser", async () => {
        await axios.get(url, {
          headers: {
            'Content-Type': 'appication/json'
          },
        }).then(function(response) {
          expect(response.status).toBe(404);
        });
      });
    });
  });
});
