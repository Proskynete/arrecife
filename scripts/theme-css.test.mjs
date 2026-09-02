/**
 * The regression test for the name clash.
 *
 * It does not eyeball `theme.css`: it compiles Tailwind for real with our tokens
 * imported on top, exactly the way a consuming project does, and looks at what
 * each utility resolves to in the CSS that comes out.
 *
 * It is the test that did not exist. `--spacing-md` was swallowing `max-w-md` in
 * every project and nothing showed here: the story suite mounts Arrecife's
 * components, and Arrecife does not use `max-w-*` internally. The failure lived
 * exactly in the gap between what the library publishes and what it uses.
 *
 * `check-tokens-namespace.mjs` covers the same ground from the names side. Both
 * two, because son razonamientos independientes: el check sabe qué nombres
 * reserva Tailwind, este sabe qué hace Tailwind de verdad al compilarlos.
 */
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';
import { compile } from 'tailwindcss';

import { themeCss } from './build-tokens.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);

/** Resolves `@import` the way a bundler would: `tailwindcss` and relative ones. */
async function loadStylesheet(id, base) {
  const path = id.startsWith('.') ? resolve(base, id) : require.resolve(`${id}/index.css`);
  return { path: path, base: dirname(path), content: await readFile(path, 'utf8') };
}

/**
 * Compiles the requested classes the way a consuming project does: Tailwind
 * first, our tokens after. `theme.css` comes inline from the generator, so the
 * test does not depend on `dist/` having been built.
 */
async function compileClasses(classes) {
  const compiler = await compile(`@import "tailwindcss";\n${themeCss}`, {
    base: root,
    loadStylesheet: loadStylesheet,
  });
  return compiler.build(classes);
}

/** The body of a class's rule, or `undefined` if it was not generated. */
function rule(css, className) {
  const escaped = className.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return css.match(new RegExp(`\\.${escaped}\\s*\\{([^}]*)\\}`))?.[1].trim();
}

/** The value declared for a custom property inside the compiled CSS. */
function property(css, name) {
  return css.match(new RegExp(`${name}:\\s*([^;]+);`))?.[1].trim();
}

/**
 * The five that broke, with the width Tailwind gives them. If any of them
 * resolves to a `--spacing-*` again, the hero paragraph goes back to one word
 * per line and this time the build finds out.
 */
const TAILWIND_WIDTHS = [
  ['max-w-xs', '20rem'],
  ['max-w-sm', '24rem'],
  ['max-w-md', '28rem'],
  ['max-w-lg', '32rem'],
  ['max-w-xl', '36rem'],
];

describe('theme.css over Tailwind v4', () => {
  it('leaves Tailwind width utilities intact', async () => {
    const css = await compileClasses(TAILWIND_WIDTHS.map(([className]) => className));

    for (const [className, width] of TAILWIND_WIDTHS) {
      const step = className.replace('max-w-', '');
      expect(rule(css, className), className).toBe(`max-width: var(--container-${step});`);
      expect(property(css, `--container-${step}`), `--container-${step}`).toBe(width);
    }
  });

  it('declares no --spacing-* named after the --container-* scale', () => {
    for (const step of ['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']) {
      expect(themeCss, `--spacing-${step}`).not.toMatch(
        new RegExp(`--spacing-${step}\\s*:`),
      );
    }
  });

  it('leaves the numeric spacing scale intact', async () => {
    const css = await compileClasses(['p-4', 'gap-2']);

    expect(rule(css, 'p-4')).toBe('padding: calc(var(--spacing) * 4);');
    expect(rule(css, 'gap-2')).toBe('gap: calc(var(--spacing) * 2);');
  });

  it('leaves Tailwind sizes and radii intact', async () => {
    const css = await compileClasses(['text-2xl', 'rounded-md']);

    expect(rule(css, 'text-2xl')).toContain('var(--text-2xl)');
    expect(rule(css, 'rounded-md')).toBe('border-radius: var(--radius-md);');
    expect(property(css, '--radius-md')).toBe('0.375rem');
  });

  it('serves the Arrecife rhythm steps under their new names', async () => {
    const css = await compileClasses(['p-step-lg', 'gap-step-sm', 'px-step-md', 'py-step-xl']);

    expect(rule(css, 'p-step-lg')).toBe('padding: var(--spacing-step-lg);');
    expect(rule(css, 'gap-step-sm')).toBe('gap: var(--spacing-step-sm);');
    expect(property(css, '--spacing-step-lg')).toBe('26px');
    expect(property(css, '--spacing-step-md')).toBe('16px');
  });

  it('serves the rest of the shape and rhythm tokens', async () => {
    const css = await compileClasses([
      'p-step-lg',
      'py-section',
      'px-control-md',
      'size-control-icon',
      'h-nav',
      'max-w-content',
      'max-w-measure',
      'rounded-card',
      'text-h1',
    ]);

    expect(rule(css, 'py-section')).toContain('var(--spacing-section)');
    expect(rule(css, 'px-control-md')).toContain('var(--spacing-control-md)');
    expect(rule(css, 'h-nav')).toBe('height: var(--spacing-nav);');
    expect(rule(css, 'max-w-content')).toBe('max-width: var(--container-content);');
    expect(rule(css, 'max-w-measure')).toBe('max-width: var(--container-measure);');
    expect(rule(css, 'rounded-card')).toBe('border-radius: var(--radius-card);');
    expect(rule(css, 'text-h1')).toContain('var(--text-h1)');
  });

  it('serves the four chart series and switches them with the mode', async () => {
    const css = await compileClasses(['bg-series-1', 'bg-series-4']);

    expect(rule(css, 'bg-series-1')).toBe('background-color: var(--color-series-1);');
    // The light-mode block has to redeclare all four: if they only appeared in
    // `@theme`, the chart would keep the dark palette on paper.
    const light = css.slice(css.indexOf("[data-theme='light']"));
    for (const n of [1, 2, 3, 4]) {
      expect(light, `--color-series-${n} en mode light`).toMatch(
        new RegExp(`--color-series-${n}\\s*:`),
      );
    }
  });

  /**
   * The `TableOfContents` hook. The variant has to compile to a PRESENCE
   * selector for the attribute — `[aria-current]`, with no value — because the
   * site's scroll-spy sets `aria-current="true"` and the controlled component
   * sets `"location"`: if the selector were tied to a value, one of the two
   * dejaría de pintarse y nada avisaría.
   */
  it('the table of contents active state reacts to aria-current with any value', async () => {
    const css = await compileClasses([
      'aria-[current]:text-accent',
      'aria-[current]:hover:text-accent',
      'hover:text-text-primary',
    ]);

    expect(css).toContain('[aria-current]');
    expect(css).not.toContain('[aria-current="location"]');
    // And the active hover carries both variants, so it wins over the generic
    // `hover:` by specificity rather than by emission order.
    expect(css).toContain('[aria-current]:hover');
  });

  it('stomps font-sans and font-mono on purpose, with the system families', async () => {
    const css = await compileClasses(['font-sans', 'font-mono', 'font-display']);

    expect(rule(css, 'font-sans')).toBe('font-family: var(--font-sans);');
    expect(property(css, '--font-sans')).toContain('Geist');
    expect(property(css, '--font-mono')).toContain('JetBrains Mono');
    expect(property(css, '--font-display')).toContain('Bricolage Grotesque');
  });
});
