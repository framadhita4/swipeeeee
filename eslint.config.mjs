import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

const config = defineConfig(
  globalIgnores(['dist', 'build', 'node_modules']),
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2024,
      },
      // Configure the TypeScript parser
      parserOptions: {
        project: ['./tsconfig.json', './example/tsconfig.json'], // Adjust based on your tsconfig names
        tsconfigRootDir: import.meta.dirname,
      },
    },
    // Set up React settings
    settings: {
      react: {
        version: 'detect',
      },
    },
    // Define the plugins used in this configuration
    plugins: {
      react: react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    // Extend recommended rulesets
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    rules: {
      // Pull in standard React Hook rules (exhaustive-deps, etc.)
      ...reactHooks.configs.recommended.rules,

      // Vite/React-Refresh specific rule for Fast Refresh compatibility
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Modern React (17+) does not require importing React in every file
      'react/react-in-jsx-scope': 'off',

      // TypeScript handles prop-types, so we can disable this React rule
      'react/prop-types': 'off',

      // Example of customizing a strict TypeScript rule
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  eslintConfigPrettier,
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
);

export default config;
