module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['./node_modules/@testing-library/jest-native/extend-expect'],
  modulePathIgnorePatterns: ['e2e'],
};
