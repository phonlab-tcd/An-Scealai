module.exports = async function main(globalConfig,projecConfig) {
  await globalThis.__MONGOD__.stop();
}
