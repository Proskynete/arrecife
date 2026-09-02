import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)', '../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
    // Forces :hover and :focus-visible so there is one story per state, instead
    // of asking the reviewer to hover and take it on trust.
    'storybook-addon-pseudo-states',
    '@storybook/addon-vitest',
  ],
  // The PNGs are served at /brand, the same path the five projects use from
  // their public/, so the `basePath` default works.
  staticDirs: ['../assets'],
  framework: { name: '@storybook/react-vite', options: {} },
  /**
   * The props table comes from the types, not from a heuristic: plain
   * `react-docgen` does not resolve `VariantProps<typeof …>`, so the cva
   * variants would come out empty. The filter leaves out the hundreds of HTML
   * attributes every component inherits, which are not Arrecife's API.
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
