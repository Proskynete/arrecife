import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

import { dark, fonts } from '../src/tokens/tokens.ts';

/**
 * El cromado del manager: barra lateral, barra superior y —lo que importaba
 * aquí— el fondo del área de contenido que queda alrededor del iframe de
 * previsualización.
 *
 * Ese fondo es el que se veía blanco en las páginas de documentación cuando la
 * ventana es más ancha que los 1200px del contenido: no lo alcanza
 * `storybook.css`, porque esa hoja vive dentro del iframe y esto está fuera.
 *
 * Va fijo en la paleta oscura: el manager es la aplicación, no el producto, y
 * no cambia con el switch de tema —que es del contenido—. El modo oscuro es el
 * primario del sistema.
 */
addons.setConfig({
  theme: create({
    base: 'dark',
    appBg: dark.background,
    appContentBg: dark.background,
    appPreviewBg: dark.background,
    appBorderColor: dark.hairline,
    barBg: dark.surface,
    barTextColor: dark.textSecondary,
    barSelectedColor: dark.accent,
    barHoverColor: dark.accentHover,
    textColor: dark.textPrimary,
    textMutedColor: dark.textSecondary,
    colorPrimary: dark.accent,
    colorSecondary: dark.accent,
    inputBg: dark.surface,
    inputBorder: dark.border,
    inputTextColor: dark.textPrimary,
    fontBase: fonts.sans,
    fontCode: fonts.mono,
    brandTitle: 'Arrecife',
  }),
});
