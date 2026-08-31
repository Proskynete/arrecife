import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import tailwindcss from '@tailwindcss/vite';

/**
 * Dos proyectos, dos preguntas distintas.
 *
 * `storybook` monta cada story en un Chromium real y le pasa axe: el criterio
 * de aceptación «el addon de a11y no reporta fallos de contraste en ninguna
 * story» solo vale si alguien lo puede volver a correr, así que un color mal
 * medido rompe el build y no se queda esperando a que alguien abra el panel.
 *
 * `unidad` corre en Node y compila Tailwind de verdad contra `theme.css`. Es lo
 * que faltaba cuando `--spacing-md` se comió `max-w-md`: la suite de stories no
 * podía verlo porque la librería no usa `max-w-*` por dentro, así que el fallo
 * solo existía en los proyectos que la consumen. Ver `scripts/theme-css.test.mjs`.
 */
export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unidad',
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
