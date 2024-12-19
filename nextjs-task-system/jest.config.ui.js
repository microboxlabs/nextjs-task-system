const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  testEnvironment: "jest-environment-jsdom",
  testMatch: ["**/tests/ui/**/*.test.tsx", "**/__tests__/ui/**/*.test.tsx"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};

module.exports = createJestConfig(customJestConfig);
