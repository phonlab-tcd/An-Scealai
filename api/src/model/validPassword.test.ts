(()=>{
  const app = require('../server');
  const User = require('../model/user');
  const crypto = require('crypto');
  
  describe('password backward compatibility', ()=>{
    it('correctly hashes passwords made with legacy hash function', async () => {
      const password = '825b16754305ea1a749c'; // crypto.randomBytes(10).toString('hex');
      const salt = '203af4bd876b2e3132a6475ee940b14e'; // crypto.randomBytes(16).toString('hex');
      // crypto.pbkdf2(password,salt,1000,64,'sha512');
      const hash = 'fb507691b502b6d7e7d76487144ccf0ae01fece7eda46ccc43005aca1982f3a49202329dd840ad44fd2f5a9e7b8aac19d55223e2963df2cd5f2b110d980a189e';
      console.log('CREATING USER');
      const username = 'fudge';
      const u = await User.create({hash,salt,username});
      expect(u.validPassword(password));
    });
  });
})();
