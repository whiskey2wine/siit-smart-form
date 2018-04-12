module.exports = {
  parser: 'babel-eslint',
  extends: 'airbnb-base',
  env: {
    node: true,
    browser: true,
    es6: true,
    jquery: true,
  },
  rules: {
    'comma-dangle': 1,
    'no-unused-vars': [
      1,
      {
        vars: 'local',
        args: 'none',
      },
    ],
    'no-param-reassign': [
      2,
      {
        props: false,
      },
    ],
    'no-console': 0,
    'consistent-return': 0,
    'func-names': 0,
    'no-underscore-dangle': 0,
    radix: [2, 'as-needed'],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
  },
};
