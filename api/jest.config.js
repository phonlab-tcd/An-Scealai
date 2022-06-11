module.exports = {
  preset: '@shelf/jest-mongodb',
  setupFiles: [ "<rootDir>/utils/test-setup.js" ],
  setupFilesAfterEnv: ["<rootDir>/utils/test-after-env.js"],
  collectCoverage: true,
};
