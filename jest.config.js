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
      displayName: "dom-axios",
      testEnvironment: "jsdom",
      setupFiles: ["./test/setupAxios.ts"],
    },
    {
      displayName: "node-axios",
      testEnvironment: "node",
      setupFiles: ["./test/setupAxios.ts"],
    },
    {
      displayName: "node-fetch",
      testEnvironment: "node",
      setupFiles: ["./test/setupFetch.ts"],
    },
  ],
};
