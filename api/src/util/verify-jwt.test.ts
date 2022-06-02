(()=>{
  const sign_jwt = require('./sign-jwt');
  const verify_jwt = require('./verify-jwt');
  
  describe('environment must be setup correctly', ()=> {
    it('has PEM_KEY_PASSPHRASE defined', () => {
      expect(process.env.PEM_KEY_PASSPHRASE);
    });
  });
  
  describe('resolve sign_jwt module to function', ()=>{
    it('resolves to string of form <a>.<b>.<c>', async ()=>{
      const jwt = await sign_jwt({a:'a',b:'b'});
      expect(jwt.split('.').length).toBe(3);
      expect(await verify_jwt(jwt));
    });
  });

  describe('password backward compatibility', ()=>{
    jest.setTimeout(10000);
    it('correctly hashes passwords made with legacy hash function', async () => {
      const crypto = require('crypto');
      const User = require('../model/user');
      const password = crypto.randomBytes(10).toString('hex');
      function salt() {
        return crypto.randomBytes(16)
          .toString('hex');
      }
      function hash(password:string,salt:string) {
        return crypto.pbkdf2Sync(password,salt,1000,64,'sha512')
          .toString('hex');
      }
      const my_salt = salt();
      const my_hash = hash(password,my_salt);
      const user = await User.create({username: 'a',hash: my_hash, salt: my_salt});
      expect(user.validPassword(password));
    });

  });
})();
