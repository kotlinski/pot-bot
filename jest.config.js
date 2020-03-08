module.exports = {
/*  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },*/
  testRegex: '(/__tests__/.*\\.test)\\.[jt]sx?$',
  modulePathIgnorePatterns: ['build'],
  moduleFileExtensions: ['ts', 'js', 'json'],
};
