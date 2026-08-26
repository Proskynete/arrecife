import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

/**
 * Criterio de aceptación como regla, no como documentación: ningún componente
 * tiene un color hexadecimal literal. Las excepciones documentadas (los tres
 * casos del modo claro invertido en `Button`) se marcan con un
 * `eslint-disable-next-line arrecife/no-hex` explícito y su comentario.
 */
const SIN_HEX_LITERAL = {
  selector: "Literal[value=/^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/]",
  message:
    'Color hexadecimal literal. Usa un token de src/tokens/ o la custom property de theme.css.',
};

const SIN_HEX_EN_TEMPLATE = {
  selector: "TemplateElement[value.raw=/#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\\b/]",
  message:
    'Color hexadecimal literal. Usa un token de src/tokens/ o la custom property de theme.css.',
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
    },
  },

  // Cero hex literales en el código fuente...
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': ['error', SIN_HEX_LITERAL, SIN_HEX_EN_TEMPLATE],
    },
  },

  // ...salvo en la fuente única, que es exactamente donde viven.
  {
    files: ['src/tokens/tokens.ts'],
    rules: { 'no-restricted-syntax': 'off' },
  },

  // Los tokens no importan nada de fuera. `check:tokens` lo verifica de verdad;
  // esto lo dice en el editor, antes de llegar al build.
  {
    files: ['src/tokens/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              // Cualquier especificador que no empiece por punto es externo.
              regex: '^[^.]',
              message:
                'src/tokens/ no importa nada: ni React, ni componentes, ni CSS de terceros.',
            },
          ],
        },
      ],
    },
  },
);
