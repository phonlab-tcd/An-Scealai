const {describe,it} = require('./inline-tests');
function resolveTimeout(ms=1000) {
  return new Promise(r=>setTimeout(r,ms));
}
module.exports = ()=>{
  describe('await teardown',()=>{
    it('await teardown', async ()=>{
      await resolveTimeout();
    });
  });
}
