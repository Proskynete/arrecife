import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

/**
 * An acceptance criterion as a rule, not as documentation: no component holds a
 * literal hexadecimal color. The documented exceptions (the three inverted
 * light-mode cases in `Button`) are marked with an explicit
 * `eslint-disable-next-line arrecife/no-hex` and its comment.
 */
const NO_HEX_LITERAL = {
  selector: "Literal[value=/^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/]",
  message:
    'Literal hexadecimal color. Use a token from src/tokens/ or the custom property from theme.css.',
};

const NO_HEX_IN_TEMPLATE = {
  selector: "TemplateElement[value.raw=/#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\\b/]",
  message:
    'Literal hexadecimal color. Use a token from src/tokens/ or the custom property from theme.css.',
};

export default tseslint.config(
  { ignores: ['dist', 'storybook-static', 'node_modules'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      /**
       * `const { variant, ...rest } = props` is how a prop is kept OUT of the
       * spread, and «`...props` is spread» is a rule of this repo's component
       * pattern: a variant that reaches the DOM is an unknown attribute and a
       * React warning. Without this the only way to strip one is a cast, which
       * is worse — it re-adds every prop the signature just took out.
       */
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    },
  },

  // Zero literal hexes in the source…
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': ['error', NO_HEX_LITERAL, NO_HEX_IN_TEMPLATE],
    },
  },

  // …except in the single source, which is exactly where they live.
  {
    files: ['src/tokens/tokens.ts'],
    rules: { 'no-restricted-syntax': 'off' },
  },

  // Tokens import nothing from outside. `check:tokens` verifies it for real;
  // this says so in the editor, before the build.
  {
    files: ['src/tokens/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              // Any specifier not starting with a dot is external.
              regex: '^[^.]',
              message:
                'src/tokens/ imports nothing: not React, not components, not third-party CSS.',
            },
          ],
        },
      ],
    },
  },
);
