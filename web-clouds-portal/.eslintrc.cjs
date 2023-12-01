/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

const { defineConfig } = require('eslint-define-config')

module.exports = defineConfig({
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  plugins: [
    'prettier',
    'unused-imports',
    'simple-import-sort',
    '@typescript-eslint'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'vue/multi-word-component-names': [
      'error',
      {
        ignores: ['Website', 'Container', 'Pagination', 'Overview']
      }
    ],
    // 'no-use-before-define': [
    //   'error',
    //   {
    //     variables: true,
    //     functions: false,
    //     classes: false,
    //     allowNamedExports: false
    //   }
    // ],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    '@typescript-eslint/consistent-type-imports': 'error',
    'no-undef': 'off',
    'no-var': 'error',
    'prefer-const': 'error',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'unused-imports/no-unused-imports': 'error',
    'vue/component-name-in-template-casing': [
      'error',
      'kebab-case',
      {
        registeredComponentsOnly: false
      }
    ],
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_'
      }
    ],
    'vue/order-in-components': 'off',
    'vue/html-self-closing': 'off',
    'vue/require-default-prop': 'off',
    'vue/max-attributes-per-line': [
      0,
      {
        singleline: 10,
        multiline: {
          max: 1,
          allowFirstLine: false
        }
      }
    ],
    'prettier/prettier': [
      'error',
      {
        semi: false,
        tabWidth: 2,
        printWidth: 80,
        useTabs: false,
        singleQuote: true,
        quoteProps: 'as-needed',
        jsxSingleQuote: false,
        trailingComma: 'none',
        bracketSpacing: true,
        jsxBracketSameLine: false,
        htmlWhitespaceSensitivity: 'css',
        arrowParens: 'avoid',
        endOfLine: 'auto'
      }
    ]
  }
})
