const config = {
  preset: "@shelf/jest-mongodb",
  setupFiles: [
    "<rootDir>/utils/test-setup.js"
  ],
  testMatch: [
    "**/*.js"
  ],
  testPathIgnorePatterns: ["/node_modules/"],
}

module.exports = config;
