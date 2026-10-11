/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  setupFilesAfterEnv: [],
  // Playwright specs in /tests are run by `npm run e2e`, not Jest.
  testPathIgnorePatterns: ['/node_modules/', '/tests/', '/.next/'],
};