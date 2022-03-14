;(async () => {
  return new Promise(async (resolve) => {
    const viewName = ''+Date.now();
    await require('../utils/gramadoirView')(viewName);
    const mongoose = require('mongoose');
    const { db } = mongoose.connection;
    const cursor = db.collection(viewName).find();
    cursor.toArray((err,docs)=>{
      console.error(err);
      docs.forEach(d=>{
        console.log(d);
      });
      db.collection(viewName).drop();
      resolve();
    });
  });
})();
