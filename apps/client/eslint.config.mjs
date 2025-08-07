// @ts-check
import js from '@eslint/js'
import globals from 'globals'

export default [
  js.configs.recommended,
  {
    ignores: ['.nuxt/**/*', 'node_modules/**/*', 'dist/**/*', '.output/**/*'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        // Nuxt globals
        definePageMeta: 'readonly',
        defineNuxtConfig: 'readonly',
        defineNuxtPlugin: 'readonly',
        defineNuxtRouteMiddleware: 'readonly',
        useRouter: 'readonly',
        useRoute: 'readonly',
        navigateTo: 'readonly',
        useRuntimeConfig: 'readonly',
        $fetch: 'readonly',
        // Vue globals
        ref: 'readonly',
        reactive: 'readonly',
        computed: 'readonly',
        watch: 'readonly',
        onMounted: 'readonly',
        onUnmounted: 'readonly',
        // Pinia globals
        useAuthStore: 'readonly',
        // Nuxt UI globals
        UButton: 'readonly',
        UIcon: 'readonly',
        UBadge: 'readonly',
        UTextarea: 'readonly',
        // Custom composables
        useApi: 'readonly',
        useAssignments: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: await import('vue-eslint-parser'),
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        parser: await import('@typescript-eslint/parser'),
      },
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: await import('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },
]
