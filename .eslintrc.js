module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
	  "semi": [2, "always"],
    'indent': 'off',
    "no-trailing-spaces": [
      2,
      {
        skipBlankLines: true
      }
    ],
    "space-before-function-paren": "off",
    "comma-dangle": "off",
    "quotes": "off",
    "spaced-comment": "off",
    "keyword-spacing": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "no-extra-semi": "off",
    "@typescript-eslint/no-extra-semi": ["error"],
    //"semi": "off",
    //"@typescript-eslint/semi": ["error"],
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
		'**/tests/**/*.spec.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}
