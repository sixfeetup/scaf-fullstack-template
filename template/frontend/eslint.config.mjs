import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

import globals from 'globals'
export default [
  // Ignores for build outputs and non-source files
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'dist/**',
      'vitest.config.ts',
      'postcss.config.mjs',
      'next.config.mjs',
      'eslint.config.mjs'
    ]
  },
  // Base (Next.js + React + a11y)
  ...compat.config({
    extends: [
      'next/core-web-vitals',
      'plugin:jsx-a11y/recommended',
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:react/jsx-runtime'
    ],
    plugins: ['jsx-a11y', 'unused-imports', 'import'],
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
  }),
  // TypeScript-specific settings and rules
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: (await import('@typescript-eslint/parser')).default,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/triple-slash-reference': 'off'
    }
  }
]
