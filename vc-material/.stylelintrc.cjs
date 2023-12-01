module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-recommended-less'],
  plugins: ['stylelint-less'],
  customSyntax: 'postcss-less',
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen']
      }
    ],
    'declaration-block-trailing-semicolon': null,
    'no-descending-specificity': null,
    'selector-class-pattern': null,
    'alpha-value-notation': null,
    'color-function-notation': null,
    'import-notation': null,
    'custom-property-empty-line-before': null,
    'rule-empty-line-before': null,
    'length-zero-no-unit': null,
    'declaration-empty-line-before': null,
    'color-hex-length': null,
    'at-rule-empty-line-before': null
  }
};
