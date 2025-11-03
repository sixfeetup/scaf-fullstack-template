import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tseslint from 'typescript-eslint'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import unusedImports from 'eslint-plugin-unused-imports'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import globals from 'globals'
export default [
  ...tseslint.configs.recommended,
  // Next.js recommended + core web vitals (flat)
  ...nextCoreWebVitals,
  // Ignores for build outputs and non-source files
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'dist/**',
      'eslint.config.mjs'
    ]
  },
  // Project-specific rules and additional plugins
  {
    plugins: {
      'unused-imports': unusedImports
    },
    settings: {
      react: { version: 'detect' }
    },
    rules: {
      'react/jsx-curly-brace-presence': 'error',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_'
        }
      ],
      'import/order': [
        'error',
        {
          alphabetize: { caseInsensitive: true, order: 'asc' },
          groups: ['external', 'builtin', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always'
        }
      ],
      'object-shorthand': ['error', 'properties'],
      'react/jsx-no-useless-fragment': 'error',
      'require-await': 'error',
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: '@apollo/client', importNames: ['gql'], message: 'Use the @/__generated__/gql to get proper typings!' },
            { name: '@apollo/client/core', importNames: ['gql'], message: 'Use the @/__generated__/gql to get proper typings!' },
            { name: '@testing-library/react', importNames: ['*'], message: 'Use the imports from test-utils instead!' }
          ]
        }
      ]
    }
  },

  // TypeScript-specific settings and rules
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname
      }
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/triple-slash-reference': 'off'
    }
  },
  // Node overrides for common config files
  {
    files: [
      '*.config.{js,mjs,ts}'
    ],
    languageOptions: {
      globals: globals.node,
      sourceType: 'module'
    },
    rules: {
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }]
    }
  },
  {
    files: ['*.config.cjs'],
    languageOptions: {
      globals: globals.node,
      sourceType: 'commonjs'
    },
    rules: {
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }]
    }
  }
]
