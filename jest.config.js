module.exports = {
  preset: 'ts-jest',
  testRegex: '.*\\/__tests__\\/.*\\.test\\.ts$',
  testEnvironment: 'node',
  collectCoverage: true,
  modulePathIgnorePatterns: ['dist'],
};
