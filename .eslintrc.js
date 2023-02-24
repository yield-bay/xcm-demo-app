module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb', 'airbnb/hooks'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'max-len': ['error', { code: 500 }],
    'import/no-unresolved': 'off',
    'import/extensions': ['error', 'never', { svg: 'always', png: 'always' }],
    'react/jsx-filename-extension': 'off',
    'react/jsx-props-no-spreading': 'off',
    'no-console': 'off',
    'operator-linebreak': 'off',
    'react/react-in-jsx-scope': 'off',
    'object-curly-newline': 'off',
    'react/jsx-one-expression-per-line': 'off',
  },
};
