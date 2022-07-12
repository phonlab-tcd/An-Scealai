async function export_keypair() {
  const keypair = require('./keypair');
  const [pub,priv] = await Promise.all([
    keypair.pub,
    keypair.priv,
  ]);
  process.env.PUB_KEY = pub;
  process.env.PRIV_KEY = priv;
}

module.exports = export_keypair();
