/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'prettier',
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'vue/attributes-order': ['error'],
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'linebreak-style': 0
  }
}
