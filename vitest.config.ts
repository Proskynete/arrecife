import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import tailwindcss from '@tailwindcss/vite';

/**
 * El criterio de aceptación «el addon de a11y no reporta fallos de contraste en
 * ninguna story» solo vale si alguien lo puede volver a correr. Esto monta cada
 * story en un Chromium real y aplica el `a11y: { test: 'error' }` declarado en
 * `.storybook/preview.tsx`, así que un color mal medido rompe el build y no se
 * queda esperando a que alguien abra el panel.
 */
export default defineConfig({
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
});
