/**
 * The check that was missing: no Arrecife token stomps on a Tailwind name.
 *
 * In Tailwind v4 the custom property name IS the API. `--spacing-*` does not
 * only feed `p-*`, `m-*` and `gap-*`: it also resolves `w-*`, `h-*`, `max-w-*`,
 * `min-w-*`, `max-h-*`, `min-h-*`, `basis-*` and `size-*`, and there it BEATS
 * the `--container-*` scale. The `spacing` steps used to be called `xs, sm, md,
 * lg, xl` — the same names as `--container-*` — so every project importing
 * `theme.css` ended up with `max-w-sm` at 12px instead of 384px.
 *
 * Nothing caught it: not the build, not the types, not Storybook, not the axe
 * suite. The library does not use `max-w-sm` internally, so the failure only
 * existed in the projects consuming it and left no console error behind. It was
 * found in production, with a hero paragraph running one word per line.
 *
 * This script turns that into a build failure. The reserved names are NOT
 * written here by hand: they are read from the `theme.css` of the installed
 * Tailwind version, so if Tailwind introduces a new step the check finds out
 * when the dependency is updated and not six months later.
 */
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { themeCss } from './build-tokens.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);

/* ------------------------------------------------ the names Tailwind reserves */

const tailwindTheme = await readFile(require.resolve('tailwindcss/theme.css'), 'utf8');

/** `--spacing-step-md: 16px` → `['spacing', 'step-md']`. Ignores `--text-h1--line-height`. */
const DECLARATION = /^\s*--([a-z]+)-([a-z0-9][a-z0-9-]*?):/gim;

/** The names Tailwind already defines per namespace, read from its theme.css. */
function namesByNamespace(css) {
  const map = new Map();
  for (const [, namespace, name] of css.matchAll(DECLARATION)) {
    if (name.includes('--')) continue; // modifiers: --text-h1--line-height
    if (!map.has(namespace)) map.set(namespace, new Set());
    map.get(namespace).add(name);
  }
  return map;
}

const fromTailwind = namesByNamespace(tailwindTheme);
const namesOf = (namespace) => fromTailwind.get(namespace) ?? new Set();

/**
 * Which names each of our namespaces cannot use, and why.
 *
 * `spacing` is the odd one and it is THE one: on top of its own namespace, it
 * swallows the `--container-*` scale across every width and height utility.
 * That is why it looks at both lists.
 */
const RESERVED = [
  {
    namespace: 'spacing',
    forbidden: () => new Set([...namesOf('spacing'), ...namesOf('container')]),
    because:
      'the width and height utilities (max-w-*, w-*, h-*, basis-*, size-*) resolve ' +
      '--spacing-* BEFORE --container-*, so this name swallows the Tailwind step',
  },
  {
    namespace: 'text',
    forbidden: () => namesOf('text'),
    because: 'text-* would stop giving the Tailwind size',
  },
  {
    namespace: 'radius',
    forbidden: () => namesOf('radius'),
    because: 'rounded-* would stop giving the Tailwind radius',
  },
  {
    namespace: 'container',
    forbidden: () => namesOf('container'),
    because: 'max-w-* would stop giving the Tailwind width',
  },
  {
    namespace: 'font',
    forbidden: () => namesOf('font'),
    because: 'font-* would stop giving the Tailwind family',
  },
  {
    namespace: 'shadow',
    forbidden: () => namesOf('shadow'),
    because: 'shadow-* would stop giving the Tailwind shadow',
  },
  {
    namespace: 'ease',
    forbidden: () => namesOf('ease'),
    because: 'ease-* would stop giving the Tailwind easing curve',
  },
  {
    namespace: 'color',
    forbidden: () => namesOf('color'),
    because: 'bg-*, text-* and border-* would stop giving the Tailwind color',
  },
];

/**
 * A numeric step in `--spacing-*` is just as poisonous and does not come out of
 * Tailwind's theme.css: `--spacing: 0.25rem` generates `p-1`…`p-96` by
 * calculation, so a `--spacing-4` of ours would stomp `p-4` without appearing in
 * any list.
 */
const NUMERIC = /^\d+(\.\d+)?$/;

/**
 * The DELIBERATE collisions. They go here with their reason, and here is where
 * they get argued.
 *
 * `font-sans` and `font-mono` are stomped on purpose: the system has its own
 * families and `font-sans` has to give Geist, not the system stack. That is the
 * whole point of importing the tokens.
 */
const DELIBERATE = new Map([
  ['--font-sans', "the system's family is Geist, not the default stack"],
  ['--font-mono', "the system's mono family is JetBrains Mono"],
]);

/* ------------------------------------------------------- what we emit ourselves */

const failures = [];

for (const [, namespace, name] of themeCss.matchAll(DECLARATION)) {
  if (name.includes('--')) continue;
  const property = `--${namespace}-${name}`;
  if (DELIBERATE.has(property)) continue;

  const rule = RESERVED.find((r) => r.namespace === namespace);
  if (rule && rule.forbidden().has(name)) {
    failures.push({ property, because: rule.because });
    continue;
  }

  if (namespace === 'spacing' && NUMERIC.test(name)) {
    failures.push({
      property,
      because: 'a numeric name in --spacing-* stomps the Tailwind p-1…p-96 scale',
    });
  }
}

if (failures.length > 0) {
  console.error(
    'An Arrecife token stomps a Tailwind name. A project importing theme.css\n' +
      'will lose that utility without any warning:\n',
  );
  for (const { property, because } of failures) {
    console.error(`  ${property}`);
    console.error(`    ${because}\n`);
  }
  console.error(
    'The fix is renaming the token in src/tokens/tokens.ts under its own group\n' +
      '(`stepMd` → --spacing-step-md), the way `spacing.step*` and `control` already do.\n' +
      'Redeclaring the Tailwind token does NOT work: ours wins resolution.',
  );
  process.exit(1);
}

const emitted = [...themeCss.matchAll(DECLARATION)].filter(([, , n]) => !n.includes('--'));
console.log(
  `arrecife · ${emitted.length} tokens, none stomping a Tailwind name ` +
    `(${relative(root, require.resolve('tailwindcss/theme.css')).replace(/^.*node_modules\//, '')})`,
);
