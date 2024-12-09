module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts", "**/__tests__/**/*.test.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};
