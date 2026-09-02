import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

import { dark, fonts } from '../src/tokens/tokens.ts';

/**
 * The manager chrome: sidebar, top bar and — the part that mattered here — the
 * background of the content area surrounding the preview iframe.
 *
 * That background is the one that showed up white on documentation pages when
 * the window is wider than the 1200px of content: `storybook.css` does not reach
 * it, because that sheet lives inside the iframe and this is outside it.
 *
 * It is pinned to the dark palette: the manager is the application, not the
 * product, and it does not follow the theme switch — which belongs to the
 * content. Dark is the system's primary mode.
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
