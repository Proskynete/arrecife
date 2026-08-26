import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)', '../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
    // Fuerza :hover y :focus-visible para tener una story por estado, en vez de
    // pedirle al que revisa que pase el mouse por encima y confíe.
    'storybook-addon-pseudo-states',
    '@storybook/addon-vitest',
  ],
  framework: { name: '@storybook/react-vite', options: {} },
  /**
   * La tabla de props sale de los tipos, no de una heurística: `react-docgen`
   * a secas no resuelve `VariantProps<typeof …>`, así que las variantes de cva
   * saldrían vacías. El filtro deja fuera los cientos de atributos HTML que
   * hereda cada componente, que no son la API de Arrecife.
   */
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) => !/node_modules/.test(prop.parent?.fileName ?? ''),
    },
  },
  viteFinal: (config) => {
    config.plugins = [...(config.plugins ?? []), tailwindcss()];
    return config;
  },
};

export default config;
