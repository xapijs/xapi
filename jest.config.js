require("dotenv").config();

module.exports = {
  preset: "ts-jest",
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  projects: [
    {
      displayName: "dom",
      testEnvironment: "jsdom",
    },
    {
      displayName: "node",
      testEnvironment: "node",
    },
  ],
};
