/* eslint-disable @typescript-eslint/no-require-imports */
// File konfigurasi Jest untuk Next.js 13

const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./", // path root project Next.js
});

const customJestConfig = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1", // alias @/ ke root project
  },
};

module.exports = createJestConfig(customJestConfig);
