const config = require("../DB");
const mongoose = require("mongoose");

async function removeAllCollections() {
  // We only want to remove the collections if mongoose
  // is connected to the test db.
  if (mongoose.connection.name !== config.TEST_DB_NAME) {
    throw new Error(
        `removeAllCollections was called but 
        the db in use is not the test db.\n
        mongoose.connection.name: ${mongoose.connection.name}\n
        config.TEST_DB_NAME: ${config.TEST_DB_NAME}
        `);
  }
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
      const collection = mongoose.connection.collections[collectionName];
      await collection.deleteMany();
  }
}

module.exports = {removeAllCollections};
