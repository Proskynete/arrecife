import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import tailwindcss from '@tailwindcss/vite';

/**
 * Two projects, two different questions.
 *
 * `storybook` mounts every story in a real Chromium and runs axe over it: the
 * acceptance criterion «the a11y addon reports no contrast failures in any
 * story» is only worth anything if somebody can re-run it, so a badly measured
 * color breaks the build instead of waiting for someone to open the panel.
 *
 * `unit` runs in Node and compiles Tailwind for real against `theme.css`. It is
 * what was missing when `--spacing-md` swallowed `max-w-md`: the story suite
 * could not see it because the library does not use `max-w-*` internally, so the
 * failure only existed in the projects consuming it. See
 * `scripts/theme-css.test.mjs`.
 */
export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          environment: 'node',
          include: ['scripts/**/*.test.mjs'],
        },
      },
      {
        plugins: [tailwindcss(), storybookTest({ configDir: '.storybook' })],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
