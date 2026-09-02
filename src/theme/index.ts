/**
 * The theme, without React.
 *
 * The library defines the WHOLE theming system — `@custom-variant light`, the
 * `[data-theme]` blocks, the palette for both modes — and until now it exposed
 * nothing that changes it. `eduardoalvarez.dev` and `links` each reimplemented
 * that separately, with their own `localStorage` and their own
 * `astro:after-swap`.
 *
 * This subpackage deliberately does not import React, exactly like `./tokens`,
 * `./og` and `./shiki`: the two projects that need it most are Astro, and one of
 * them ships no framework JavaScript at all. What gets published here is the
 * hard part of the component — avoiding the first-paint flash and surviving
 * navigation — not the button. The button is `ThemeToggle`; it lives at the root
 * and uses this underneath.
 *
 * `check-package-exports.mjs` verifies that `./theme` does not drag React into
 * the published `dist/`, same as the other three portable subpaths.
 */

/** The two modes. Dark is primary and is the system default. */
export type Theme = 'dark' | 'light';

/**
 * The `localStorage` key.
 *
 * It carries the library name because `localStorage` belongs to the origin, not
 * to the project: a bare `theme` collides with whatever else lives on the same
 * domain.
 */
export const THEME_KEY = 'arrecife-theme';

/** The attribute the `[data-theme]` blocks in `theme.css` read. */
export const THEME_ATTRIBUTE = 'data-theme';

/**
 * The event emitted when the theme changes.
 *
 * It exists because `storage` only notifies the OTHER tabs: in the tab that made
 * the change nothing fires, and a site with two theme controls — the header and
 * the footer — would leave one of them showing the wrong icon.
 */
export const THEME_EVENT = 'arrecife:theme';

const isTheme = (value: unknown): value is Theme => value === 'dark' || value === 'light';

/**
 * The theme currently in place, read from the DOM.
 *
 * From the DOM and not from `localStorage`, deliberately: the head script has
 * already resolved the stored preference against the system one, and resolving
 * it again here is how the two answers drift apart.
 */
export function currentTheme(): Theme {
  if (typeof document === 'undefined') return 'dark';
  const set = document.documentElement.getAttribute(THEME_ATTRIBUTE);
  return isTheme(set) ? set : 'dark';
}

/**
 * The stored preference, if any. `null` means «nobody has chosen», which is not
 * the same as «chose dark»: with no choice, the system decides.
 */
export function storedTheme(): Theme | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const value = localStorage.getItem(THEME_KEY);
    return isTheme(value) ? value : null;
  } catch {
    // Safari in private mode throws on read. A theme is no reason to break the page.
    return null;
  }
}

/**
 * What a site decides when nobody has chosen yet.
 *
 * `base` is not «the fallback», it is «this site IS this mode». Passing it stops
 * the OS from being consulted at all, which is the whole point: the five
 * projects are dark by decision, and with the OS in charge somebody running
 * their machine in light mode saw the blog in light — the opposite of what was
 * agreed.
 *
 * Left out, the OS decides and dark is the fallback. That was the only
 * behaviour until 0.6.0, and it is still the right default for a library: a site
 * that has not decided should follow the reader.
 */
export type ThemeOptions = {
  /** The mode this site is. Given, `prefers-color-scheme` is not consulted. */
  base?: Theme | undefined;
};

/**
 * The theme that applies: whatever was chosen, and with no choice, `base` if the
 * site declared one, else whatever the system asks for. With no
 * `prefers-color-scheme` declared, dark, which is primary.
 */
export function preferredTheme({ base }: ThemeOptions = {}): Theme {
  const stored = storedTheme();
  if (stored) return stored;
  if (base) return base;
  if (typeof matchMedia === 'undefined') return 'dark';
  return matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

/**
 * Sets the theme on `<html>` and persists it.
 *
 * It writes the attribute ALWAYS, including for `dark`. The system default does
 * not need the attribute, but leaving it explicit is what lets a subtree declare
 * the opposite mode — a code block sits on hull in both themes — without
 * inheriting from an unmarked `<html>`.
 */
export function applyTheme(theme: Theme, persist = true): void {
  if (typeof document === 'undefined') return;

  document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
  document.documentElement.style.colorScheme = theme;

  if (persist) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // See `storedTheme`: private mode is not an application error.
    }
  }

  dispatchEvent(new CustomEvent<Theme>(THEME_EVENT, { detail: theme }));
}

/** Switches to the opposite one and returns whichever stuck. */
export function toggleTheme(): Theme {
  const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}

/**
 * Subscribes to theme changes and returns the function that cancels it.
 *
 * It listens to both sources: our own event — the control in this tab — and
 * `storage`, which is a change made in another one. Without the second, two open
 * tabs sit on different themes until one of them is reloaded.
 */
export function watchTheme(
  onChange: (theme: Theme) => void,
  options: ThemeOptions = {},
): () => void {
  if (typeof window === 'undefined') return () => {};

  const own = (event: Event) => {
    const detail = (event as CustomEvent<Theme>).detail;
    if (isTheme(detail)) onChange(detail);
  };

  const otherTab = (event: StorageEvent) => {
    if (event.key !== THEME_KEY) return;
    const theme = isTheme(event.newValue) ? event.newValue : preferredTheme(options);
    applyTheme(theme, false);
    onChange(theme);
  };

  addEventListener(THEME_EVENT, own);
  addEventListener('storage', otherTab);

  return () => {
    removeEventListener(THEME_EVENT, own);
    removeEventListener('storage', otherTab);
  };
}

/**
 * The script that goes INLINE in the `<head>`, before any stylesheet.
 *
 * This is the hard part, and it is the part that got rewritten in every project.
 * Without it the first paint comes out in the default theme and the correct one
 * arrives a frame later: on a dark site that the reader left in light mode, that
 * is a white flash on every load.
 *
 * It has to be a string and it has to be inline. A `<script src>`, even a
 * synchronous one, gets downloaded: the flash comes back. So this is not a
 * module you import, it is text you inject:
 *
 * ```astro
 * ---
 * import { themeScript } from '@eduardoalvarez/arrecife/theme';
 * ---
 * <head>
 *   <script is:inline set:html={themeScript} />
 * </head>
 * ```
 *
 * ```tsx
 * // Next, in the root layout.
 * <head>
 *   <script dangerouslySetInnerHTML={{ __html: themeScript }} />
 * </head>
 * ```
 *
 * It re-attaches on `astro:after-swap` because Astro's view transitions replace
 * the whole `<html>`: without that line the theme is lost on navigation and the
 * flash returns, this time mid-session.
 *
 * `base` is what the five projects were missing. All of them are dark BY
 * DECISION — `eduardoalvarez.dev`'s own script said so out loud: «dark is the
 * brand's PRIMARY mode, so it's the default and doesn't follow the OS setting».
 * With the OS in charge, somebody running their machine in light mode saw the
 * blog in light, which is the opposite of what was agreed, and there was no way
 * to say otherwise: the export was a fixed string with no parameter. So those
 * projects kept their own `public/theme.js` and the library published the hard
 * part for nobody.
 *
 * Called with no options it behaves exactly as it did before: the OS decides and
 * dark is the fallback. That is still the right default for a library — a site
 * that has not decided should follow its reader.
 *
 *     <script is:inline set:html={themeScript({ base: 'dark' })} />
 */
export function themeScript({ base }: ThemeOptions = {}): string {
  return [
  '(function () {',
  '  var KEY = ' + JSON.stringify(THEME_KEY) + ';',
  '  function resolve() {',
  '    try {',
  '      var stored = localStorage.getItem(KEY);',
  '      if (stored === "dark" || stored === "light") return stored;',
  '    } catch (e) {}',
  base
    ? '    return ' + JSON.stringify(base) + ';'
    : '    return matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";',
  '  }',
  '  function apply() {',
  '    var theme = resolve();',
  '    document.documentElement.setAttribute(' + JSON.stringify(THEME_ATTRIBUTE) + ', theme);',
  '    document.documentElement.style.colorScheme = theme;',
  '  }',
  '  apply();',
  '  document.addEventListener("astro:after-swap", apply);',
  '})();',
  ].join('\n');
}
