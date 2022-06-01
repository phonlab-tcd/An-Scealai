let keypair = require('./keypair');

describe('keypairs resolve to strings', function() {
  // let keypair: Keypair;
  beforeAll(async () => {
    // keypair = await import('./keypair.js') as {pub:any;priv:any;};
    return;
  });
  it('has pub key', async function() {
    const k = new String(await keypair.pub);
    console.log(k);
    expect(k.includes('PUBLIC'));
  });
  it('has pub key', async function() {
    const k = new String(await keypair.priv);
    console.log(k);
    expect(k.includes('PRIVATE'));
  });
});
