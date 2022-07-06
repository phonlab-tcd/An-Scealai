;(async () => {
  const viewName = ''+Date.now();
  await require('../utils/gramadoirView')(viewName);
  const mongoose = require('mongoose');
  const { db } = mongoose.connection;
  const cursor = db.collection(viewName).find({},{allowDiskUse:true});
  const docs = await cursor.toArray();
  docs[200].gramadoirHistory.map(a=>console.dir(a.gramadoir));
  db.collection(viewName).drop();
  process.exit(0);
})();
