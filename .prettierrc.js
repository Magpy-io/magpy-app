module.exports = {
  trailingComma: 'all',
  printWidth: 95,
  tabWidth: 2,
  singleQuote: true,
  bracketSpacing: true,
  importOrder: ['^react$|^react-native$', '^.*mock.*', '^[A-Za-z].*|^@.*', '^[~].*', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  arrowParens: 'avoid',
  bracketSameLine: true,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
};
