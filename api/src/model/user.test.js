require('./user');
const mongoose = require('mongoose');
describe('user mongoose model', () => {
  const User = mongoose.model('User');
  it('uses the user model', () => {
    expect(new User).toBeDefined();
  });
});
