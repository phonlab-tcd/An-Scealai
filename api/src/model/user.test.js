require('./user');
const mongoose = require('mongoose');
const User = mongoose.model('User');

describe('user mongoose model', () => {
  it('uses the user model', async () => {
    await expect(new User).toBeDefined();
  });
});
