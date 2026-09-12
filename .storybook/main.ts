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
  //
  // `.storybook/public` is the Storybook's OWN chrome and is deliberately a
  // second directory rather than a file dropped into `assets/`: `files` in
  // package.json ships `assets`, so anything put there is published to npm, and
  // the favicon of a documentation site is not part of the package's surface.
  //
  // What it holds is `favicon.ico` — byte for byte the one `eduardoalvarez.dev`
  // and `blog-content-manager` already serve — and `favicon.png` at 192, which
  // is the same mark at the size `links` and `cursos` use. It was NOT redrawn
  // for this site: the four projects had already settled what the mark is, and
  // this library records rather than invents.
  staticDirs: ['../assets', '../.storybook/public'],
  /**
   * The tab icon, declared rather than left to be discovered.
   *
   * Storybook does pick a root `/favicon.ico` out of a static dir by itself, and
   * that is a behaviour of the builder and not a contract: it is two lines to
   * say it outright, and the failure it avoids — the site quietly wearing
   * Storybook's default mark again after an upgrade — looks like nothing at all.
   *
   * It goes on the MANAGER and not in `preview-head.html`, which is the `<head>`
   * of the story iframe and has no tab of its own.
   */
  managerHead: (head) => `${head}
    <link rel="icon" href="./favicon.ico" sizes="16x16 32x32" />
    <link rel="icon" type="image/png" href="./favicon.png" sizes="192x192" />
    <link rel="apple-touch-icon" href="./favicon.png" />`,
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
