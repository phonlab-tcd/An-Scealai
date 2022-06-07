describe('keypairs resolve to strings', function() {
  it('has pub key', async function() {
    const k = new String(await require('./keypair').pub);
    expect(k.includes('PUBLIC'));
  });
  it('has pub key', async function() {
    const k = new String(await require('./keypair').priv);
    expect(k.includes('PRIVATE'));
  });
});
