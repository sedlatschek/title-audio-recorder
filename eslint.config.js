import eslintJs from '@eslint/js';
import prettierConfig from '@vue/eslint-config-prettier';
import eslintImport from 'eslint-plugin-import';
import eslintVue from 'eslint-plugin-vue';
import globals from 'globals';
import eslintTypescript from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ['**/dist/**/*', '**/node_modules/**/*'] },
  { files: ['**/*.{js,mjs,cjs,ts,vue}'] },
  { languageOptions: { globals: globals.browser } },
  {
    plugins: { import: eslintImport },
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
  eslintJs.configs.recommended,
  ...eslintTypescript.configs.recommended,
  ...eslintVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: eslintTypescript.parser,
      },
    },
  },
  prettierConfig,
  {
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            'src/background/*',
            '../background/*',
            '../../background/*',
            'src/content/*',
            '../content/*',
            '../../content/*',
            'src/options/*',
            '../options/*',
            '../../options/*',
            'src/popup/*',
            '../popup/*',
            '../../popup/*',
          ],
        },
      ],
    },
  },
];
