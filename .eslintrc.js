module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
  },
  extends: ['plugin:vue/essential', 'eslint:recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
  overrides: [
    {
      files: ['cypress/**/*.js'],
      env: {
        mocha: true,
      },
      globals: {
        cy: 'readonly',
        Cypress: 'readonly',
      },
    },
  ],
};
