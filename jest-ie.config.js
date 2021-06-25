// jest.config.js
// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  verbose: true,
  testPathIgnorePatterns: ["/node_modules/", "/src/"],
  testTimeout: 20000
};

module.exports = config;