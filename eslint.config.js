// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', '.expo/*'],
  },
  {
    // unrs-resolver has no native binding on Termux (Android arm64).
    // TypeScript already checks imports via `npm run typecheck`.
    rules: {
      'import/namespace': 'off',
      'import/no-unresolved': 'off',
      'import/no-duplicates': 'off',
      'import/default': 'off',
      'import/named': 'off',
      'import/export': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
    },
  },
]);
