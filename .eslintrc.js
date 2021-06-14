const OFF = 0
const ERROR = 2

module.exports = {
  env: {
    es6: true,
    node: true,
    mocha: true,
    browser: true,
  },
  extends: ['airbnb-base', 'prettier'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: '2020',
    sourceType: 'module',
  },
  plugins: ['import', 'prettier'],
  rules: {
    'import/extensions': [OFF],
    'prettier/prettier': [ERROR],
    'no-bitwise': [OFF],
    'no-multi-str': [OFF],
    'no-nested-ternary': [OFF], // yeah right
    'no-param-reassign': [ERROR, { props: false }],
    'no-restricted-syntax': [OFF],
    'no-return-assign': [ERROR, 'except-parens'],
    'no-underscore-dangle': [OFF],
    'no-unused-vars': [ERROR, { varsIgnorePattern: '^_' }],
    'no-use-before-define': [ERROR, { functions: false }],
  },
}
