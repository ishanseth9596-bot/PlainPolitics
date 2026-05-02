export default {
  testEnvironment: "node",
  transform: {},
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  },
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "html"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  collectCoverageFrom: [
    "**/*.js",
    "!**/node_modules/**",
    "!**/test/**",
    "!**/coverage/**",
    "!jest.config.js",
    "!index.js" // Exclude entry point
  ],
  verbose: true
};
