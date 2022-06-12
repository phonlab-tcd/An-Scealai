function randomString() {
  return Math.random().toString(20).substr(2);
}

module.exports = {randomString};
