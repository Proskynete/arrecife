import type { Preview } from "@storybook/react-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import {
  decorators as pseudoStates,
  initialGlobals as pseudoStatesGlobals,
} from "storybook-addon-pseudo-states/preview";

import { DocsPage } from "./docs-page.tsx";
import "./storybook.css";

/**
 * The default theme can be pinned from the environment so the accessibility
 * suite runs in both modes: a color only fails in one of them, so passing in
 * dark proves nothing about light.
 */
const initialTheme =
  import.meta.env["STORYBOOK_THEME"] === "light" ? "light" : "dark";


const preview: Preview = {
  decorators: [
    /**
     * Pseudo-states first. They are registered through their decorators and not
     * with the `addons` key: that key exists on Storybook's core type but not on
     * the `Preview` that `@storybook/react-vite` re-exports, so it does not
     * compile. Listing it in `main.ts` hooks nothing up in Storybook 10 either.
     */
    ...pseudoStates,

    // Everything mounts on `background`: if a component declares no background
    // of its own, it looks exactly as it will look in a real project.
    (Story) => (
      <div className="bg-background text-text-primary font-sans p-step-lg">
        <Story />
      </div>
    ),

    /**
     * The theme switch has lived in the toolbar since day one: it is how you
     * catch in time that a component has a literal color instead of a token.
     */
    withThemeByDataAttribute({
      themes: { dark: "dark", light: "light" },
      defaultTheme: initialTheme,
      attributeName: "data-theme",
    }),
  ],
  initialGlobals: {
    ...pseudoStatesGlobals,
  },
  // Every component publishes its documentation page with the props table. It
  // is what whoever consumes it from another project will read, and they do not
  // have the code in front of them.
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    /**
     * The default page plus «Using it with an agent», which is generated per
     * component from the story's own `title` and `component`. Set here rather
     * than in fifty story files: see `docs-page.tsx`.
     */
    docs: { page: DocsPage },
    /**
     * The sidebar reads as a path through the system rather than as an
     * alphabet: how to install it, then what it is made of, then the pieces,
     * then the pieces composed. Without this the first thing a visitor lands on
     * is `Brand/Assets`, which is the one page that assumes everything else.
     *
     * Anything not listed keeps its place after these.
     */
    options: {
      storySort: {
        order: [
          'Arrecife',
          'Tokens',
          'Brand',
          'Primitives',
          'Components',
          'Forms',
          'Charts',
          'Icons',
          'Recipes',
        ],
      },
    },
    // The background comes from the token, not from the backgrounds addon.
    backgrounds: { disabled: true },
    a11y: { test: "error" },
    controls: { matchers: { color: /(background|color)$/i } },
  },
};

export default preview;
