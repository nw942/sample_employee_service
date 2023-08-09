
module.exports = {

    /* See https://typescript-eslint.io/linting/configs/ */
    /* extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'], */
    extends: ['plugin:@typescript-eslint/strict-type-checked'],

    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    root: true,
    "ignorePatterns": ["test/**/*", "dist/**/*"],

    "parserOptions": {
      "project": ["tsconfig.json"]
  },
  };
