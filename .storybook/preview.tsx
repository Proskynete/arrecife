import type { Preview } from "@storybook/react-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import {
  decorators as pseudoStates,
  initialGlobals as pseudoStatesGlobals,
} from "storybook-addon-pseudo-states/preview";

import "./storybook.css";

/**
 * El tema por defecto se puede fijar desde el entorno para correr la suite de
 * accesibilidad en los dos modos: un color solo falla en uno de ellos, así que
 * pasar en oscuro no prueba nada sobre el claro.
 */
const temaInicial =
  import.meta.env["STORYBOOK_THEME"] === "claro" ? "claro" : "oscuro";


const preview: Preview = {
  decorators: [
    /**
     * Pseudo-estados primero. Se registran por sus decoradores y no con la
     * clave `addons`: esa existe en el tipo del núcleo de Storybook pero no en
     * el `Preview` que reexporta `@storybook/react-vite`, así que no compila.
     * Listarlo en `main.ts` tampoco engancha nada en Storybook 10.
     */
    ...pseudoStates,

    // Todo se monta sobre `background`: si un componente no declara su propio
    // fondo, se ve exactamente como se va a ver en un proyecto real.
    (Story) => (
      <div className="bg-background text-text-primary font-sans p-step-lg">
        <Story />
      </div>
    ),

    /**
     * El switch de tema vive en la toolbar desde el primer día: es como se
     * detecta a tiempo que un componente tiene un color literal en vez de un
     * token.
     */
    withThemeByDataAttribute({
      themes: { oscuro: "dark", claro: "light" },
      defaultTheme: temaInicial,
      attributeName: "data-theme",
    }),
  ],
  initialGlobals: {
    ...pseudoStatesGlobals,
  },
  // Cada componente publica su página de documentación con la tabla de props.
  // Es lo que va a leer quien lo consuma desde otro proyecto, que no tiene el
  // código delante.
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    // El fondo lo manda el token, no el addon de backgrounds.
    backgrounds: { disable: true },
    a11y: { test: "error" },
    controls: { matchers: { color: /(background|color)$/i } },
  },
};

export default preview;
