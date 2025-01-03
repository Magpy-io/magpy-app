module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        cwd: 'babelrc',
        extensions: ['.ts', '.tsx', '.js', '.ios.js', '.android.js'],
        alias: {
          '~': './src',
        },
      },
    ],
    'jest-hoist',
    '@babel/plugin-transform-export-namespace-from',
    'react-native-reanimated/plugin',
  ],
};
