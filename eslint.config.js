import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

// Clean up globals to remove any leading or trailing whitespace
const cleanGlobals = obj => {
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key.trim(), value]));
};

export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '.husky/**',
      'scripts/**',
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      'server/dist/**',
      '**/server/dist/**',
    ],
  },
  ...tseslint.config(js.configs.recommended, ...tseslint.configs.recommended, {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...cleanGlobals(globals.browser),
        ...cleanGlobals(globals.node),
        ...cleanGlobals(globals.jest),
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  }),
];
