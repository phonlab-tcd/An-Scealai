const mongoose = require('mongoose');
describe('sanity check', () => {
  afterAll(()=>{ mongoose.connection.close();});
  it('passes', async () =>  {
    expect(true);
  });
});
