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
})();
