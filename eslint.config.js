import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['dist/**', 'android/**', 'node_modules/**', 'coverage/**', 'test-results/**', 'playwright-report/**', 'art/build/**', 'docs/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    languageOptions: { globals: { ...globals.browser } },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  {
    // D-48: screens and UI building blocks ask rights only via useApp().has(right).
    // They never read the purchase state, a provider or storage directly.
    files: ['src/features/**/*.{ts,tsx}', 'src/ui/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['**/domain/entitlements', '**/domain/entitlements.ts'], message: 'Ask rights via useApp().has(right) (D-48).' },
            { group: ['**/platform/storage/**'], message: 'Screens read data from the store (useApp), never from storage (D-48).' },
          ],
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'MemberExpression[property.name=/^(entitlements|purchases?|rights)$/]',
          message: 'Ask rights via useApp().has(right); never read the purchase state directly (D-48).',
        },
        {
          selector: "Literal[value='entitlements']",
          message: 'Ask rights via useApp().has(right); never read the purchase state directly (D-48).',
        },
      ],
    },
  },
  {
    files: ['scripts/**/*.{js,mjs,ts}', 'art/**/*.mjs', '*.config.{js,ts}', 'tests/e2e/**/*.ts'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
    rules: { 'no-console': 'off' },
  },
);
