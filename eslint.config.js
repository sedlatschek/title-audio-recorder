import eslintJs from "@eslint/js";
import eslintImport from 'eslint-plugin-import';
import eslintVue from "eslint-plugin-vue";
import globals from "globals";
import eslintTypescript from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {ignores: ["**/dist/**/*", "**/node_modules/**/*", "**/.werk/**/*"]},
  {files: ["**/*.{js,mjs,cjs,ts,vue}"]},
  {languageOptions: { globals: globals.browser }},
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
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
  eslintJs.configs.recommended,
  ...eslintTypescript.configs.recommended,
  ...eslintVue.configs["flat/essential"],
  {files: ["**/*.vue"], languageOptions: {parserOptions: {parser: eslintTypescript.parser}}},
];
