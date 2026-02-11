const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {

  projects: [
    {
      displayName: "unit",
      testMatch: ["<rootDir>/__tests__/backend/**/*.test.ts"],
      testEnvironment: "node",
      setupFilesAfterEnv: ["<rootDir>/jest.intigration.setup.js"],
      transform: {
        "^.+\\.(ts|tsx)$": ["ts-jest", { useESM: true }],
      },
      transformIgnorePatterns: [
        "/node_modules/(?!(@prisma|prisma)/)",
      ],
      moduleNameMapper: {
        // ...
        '^@/(.*)$': '<rootDir>/$1',
      }
    },
    {
      displayName: "frontend",
      testMatch: ["<rootDir>/__tests__/frontend/**/*.test.{ts,tsx}"],
      testEnvironment: "jsdom",
      setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
      transform: {
        "^.+\\.(ts|tsx)$": ["ts-jest", { useESM: true }],
      },
      moduleNameMapper: {
        // ...
        '^@/(.*)$': '<rootDir>/$1',
      }
    },
  ],
};

module.exports = createJestConfig(customJestConfig);
