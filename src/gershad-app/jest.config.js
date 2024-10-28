// Based on https://github.com/zeit/next.js/tree/canary/examples/with-jest

const dotenv = require("dotenv");
const nextJest = require("next/jest");

dotenv.config({ override: true, path: ".env.test" });
const validateEnvironmentVariables = require("./src/utils/environment/validateEnvironmentVariables");

validateEnvironmentVariables();

// @ts-expect-error (seems like next/jest’s compiled CJS is wrong?)
const createJestConfig = nextJest();

/** @type {import('@jest/types').Config.InitialOptions} */
const jestConfig = {
  moduleNameMapper: {
    "^src/(.*)": "<rootDir>/src/$1",
  },
  passWithNoTests: true,
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  testRegex: ".*\\.jest\\.test\\.tsx?$",
};

module.exports = createJestConfig(jestConfig);
