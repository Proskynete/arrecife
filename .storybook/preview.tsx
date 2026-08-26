import type { Preview } from '@storybook/react-vite';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import pseudoStates from 'storybook-addon-pseudo-states';

import './storybook.css';

/**
 * El switch de tema vive en la toolbar desde el primer día: es como se detecta
 * a tiempo que un componente tiene un color literal en vez de un token.
 */
/**
 * El tema por defecto se puede fijar desde el entorno para correr la suite de
 * accesibilidad en los dos modos: un color solo falla en uno de ellos, así que
 * pasar en oscuro no prueba nada sobre el claro.
 */
const temaInicial = import.meta.env['STORYBOOK_THEME'] === 'claro' ? 'claro' : 'oscuro';

const preview: Preview = {
  // El addon de pseudo-estados se registra aquí, no en `main.ts`: en Storybook 10
  // expone la API de preview-addon y listarlo solo en `addons` no engancha nada.
  addons: [pseudoStates()],
  decorators: [
    // Todo se monta sobre `background`: si un componente no declara su propio
    // fondo, se ve exactamente como se va a ver en un proyecto real.
    (Story) => (
      <div className="bg-background text-text-primary font-sans p-lg">
        <Story />
      </div>
    ),
    withThemeByDataAttribute({
      themes: { oscuro: 'dark', claro: 'light' },
      defaultTheme: temaInicial,
      attributeName: 'data-theme',
    }),
  ],
  // Cada componente publica su página de documentación con la tabla de props.
  // Es lo que va a leer quien lo consuma desde otro proyecto, que no tiene el
  // código delante.
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    // El fondo lo manda el token, no el addon de backgrounds.
    backgrounds: { disable: true },
    a11y: { test: 'error' },
    controls: { matchers: { color: /(background|color)$/i } },
  },
};

export default preview;
