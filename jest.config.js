module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['./node_modules/@testing-library/jest-native/extend-expect'],
  modulePathIgnorePatterns: ['e2e'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native(-.*)?|react-redux|@react-native(-community)?|@rneui)/)',
  ],
};
