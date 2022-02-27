module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module'
  },
  env: { es2021: true, browser: true, node: true },
  plugins: ['import', 'simple-import-sort', 'tailwindcss', 'import-access'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:tailwindcss/recommended',
    'prettier'
  ],
  rules: {
    'no-console': ['warn', { allow: ['warn', 'info', 'error'] }],
    'prefer-arrow-callback': 'error',
    'prefer-const': 'error',
    'func-style': ['error', 'expression'],

    'import/newline-after-import': ['error'],
    'import/no-default-export': 'error',
    'import-access/jsdoc': 'error',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',

    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }
    ]
  }
}
