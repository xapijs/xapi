require("dotenv").config();

module.exports = {
  preset: "ts-jest",
  setupFiles: ["./jest.setup.js"],
  testURL: process.env.LRS_ENDPOINT
};
