/**
 * What gets published is `dist/`, not `src/`.
 *
 * A badly declared subpath in `exports` compiles just fine and does not fail
 * until somebody imports it from another project — which is the worst moment to
 * find out. This check runs after `build` and verifies three things:
 *
 *   1. Every file `exports` promises really exists in `dist/`.
 *   2. Every entry in `files` exists.
 *   3. The portable subpaths — `./tokens`, `./theme`, `./og`, `./shiki` — do not
 *      drag React in. That is THE constraint of the library: they are consumed
 *      by a Satori OG generator, by an `astro.config.mjs` and by a site that
 *      never mounts React. The moment a token depends on a component, they stop
 *      being portable.
 *
 * The third one is checked by FOLLOWING the relative imports, not by reading the
 * entry file and stopping there. With `treeshake` on, tsup splits the code into
 * chunks and each portable entry ends up as two lines re-exporting from
 * `../chunk-XXXX.js`: a grep over those two lines finds no React even when the
 * chunk imports it. The check would pass and the subpath would be broken, which
 * is a way of failing this repo already knows.
 */
import { access, readFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { CLIENT_ENTRIES } from './add-use-client.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));

/** The ones that cannot depend on React, with the reason written beside them. */
const PORTABLE = {
  './tokens': 'all five projects, Satori and a React-less Astro consume it',
  './theme': 'an Astro that mounts no React consumes it, and `themeScript` goes inline in the <head>',
  './variants': 'it is the class vocabulary for a project that mounts no React, and for a server component',
  './og': 'it runs in a worker or in a build script',
  './shiki': 'it is consumed from astro.config.mjs',
};

const failures = [];

/** Walks the `exports` object and returns every file path in it. */
function paths(value, subpath, output = []) {
  if (typeof value === 'string') {
    if (value.startsWith('./')) output.push({ subpath, file: value });
    return output;
  }
  if (value && typeof value === 'object') {
    for (const nested of Object.values(value)) paths(nested, subpath, output);
  }
  return output;
}

const exists = async (p) => access(resolve(root, p)).then(() => true, () => false);

for (const [subpath, value] of Object.entries(pkg.exports ?? {})) {
  // Wildcards (`./assets/*`) cannot be resolved one by one.
  if (subpath.includes('*')) continue;

  for (const { file } of paths(value, subpath)) {
    if (!(await exists(file))) {
      failures.push(`exports["${subpath}"] promises ${file} and it does not exist`);
    }
  }
}

for (const entry of pkg.files ?? []) {
  if (!(await exists(entry))) {
    failures.push(`files includes "${entry}" and it does not exist`);
  }
}

/**
 * `bin` too, and it is checked separately from `exports` because it fails in a
 * different way: a missing `main` is an import error the moment somebody writes
 * the import, and a missing `bin` is `npx arrecife` printing «command not found»
 * to a person who is already looking for something that is silently broken.
 */
for (const [name, file] of Object.entries(pkg.bin ?? {})) {
  if (!(await exists(file))) {
    failures.push(`bin["${name}"] promises ${file} and it does not exist`);
  }
}

/**
 * Every module specifier in the file, wherever it comes from: `import x from`,
 * `export … from`, `import "for-effect"` and `require()`.
 *
 * They are ALL extracted and classified afterwards, rather than hunting for
 * «react» with a pattern. A pattern is written against the shapes you happen to
 * remember and misses the rest: the previous version of this check looked for
 * `from "react"` and let a bare `import "react"` through, which imports React
 * just the same.
 */
const SPECIFIERS = /(?:\bfrom\s*|\bimport\s*|\brequire\(\s*)['"]([^'"]+)['"]/g;

const isReact = (specifier) =>
  /^react(-dom)?(\/|$)/.test(specifier);

/**
 * The files in `entry`'s subtree that import React, following relative imports.
 * It returns every culprit, not the first one: if a shared chunk slips in, it is
 * worth seeing which entries hang off it in a single pass.
 */
async function withReact(entry) {
  const seen = new Set();
  const culprits = [];
  const pending = [entry];

  while (pending.length > 0) {
    const current = pending.pop();
    if (seen.has(current)) continue;
    seen.add(current);

    if (!(await exists(current))) continue;
    const source = await readFile(resolve(root, current), 'utf8');

    for (const [, specifier] of source.matchAll(SPECIFIERS)) {
      if (isReact(specifier)) {
        culprits.push(current);
      } else if (specifier.startsWith('.')) {
        pending.push(`./${relative(root, resolve(root, dirname(current), specifier))}`);
      }
    }
  }

  return [...new Set(culprits)];
}

for (const [subpath, reason] of Object.entries(PORTABLE)) {
  const declared = pkg.exports?.[subpath];
  if (!declared) {
    failures.push(`missing subpath ${subpath} in exports`);
    continue;
  }

  for (const { file } of paths(declared, subpath)) {
    if (!file.endsWith('.js') && !file.endsWith('.cjs')) continue;
    if (!(await exists(file))) continue;

    for (const culprit of await withReact(file)) {
      failures.push(`${subpath} imports React in ${culprit} — ${reason}`);
    }
  }
}

/**
 * The fourth thing: `"use client"` is where it should be, and only there.
 *
 * It is checked in both directions because both of them broke something real.
 * Missing from a client entry, Next cannot import the library at all — a
 * `createContext is not a function` at build time, and it blocked `cursos` for a
 * version. Present on a portable entry, a Server Component importing
 * `buttonVariants` drags a client boundary in for a function that returns a
 * string, which is the cost `./variants` exists to avoid.
 *
 * The second direction is checked against EVERY subpath and not only against the
 * portable ones, which is the newer half. `./social` is neither: it renders
 * React, so it can never be portable, and it must not be a client entry either —
 * the whole reason it exists is that a Next Server Component can render an icon
 * without opening a boundary for two `<svg>`. Listed only in `PORTABLE`, the
 * check had nothing to say about it, and adding it to `CLIENT_ENTRIES` by
 * mistake would have quietly undone the fix. Now the rule is the one the
 * docstring already claimed: the directive is on `CLIENT_ENTRIES` and nowhere
 * else.
 *
 * The directive is stamped by `scripts/add-use-client.mjs`, and it is checked
 * here rather than trusted because tsup's own `banner` already dropped it once
 * without the build going red.
 */
const directive = /^\s*(['"])use client\1;?/;

for (const entry of CLIENT_ENTRIES) {
  if (!(await exists(entry))) {
    failures.push(`${entry} does not exist — did the build run?`);
    continue;
  }
  const source = await readFile(resolve(root, entry), 'utf8');
  if (!directive.test(source)) {
    failures.push(
      `${entry} has no "use client" — Next cannot import the library without it`,
    );
  }
}

const client = new Set(CLIENT_ENTRIES.map((entry) => `./${entry}`));

for (const [subpath, value] of Object.entries(pkg.exports ?? {})) {
  if (subpath.includes('*')) continue;

  for (const { file } of paths(value, subpath)) {
    if (!file.endsWith('.js') && !file.endsWith('.cjs')) continue;
    if (client.has(file)) continue;
    if (!(await exists(file))) continue;

    const source = await readFile(resolve(root, file), 'utf8');
    if (!directive.test(source)) continue;

    failures.push(
      PORTABLE[subpath]
        ? `${file} carries "use client" and it is portable — it would drag a client boundary in`
        : `${file} carries "use client" and it is not a client entry — a Server Component importing ${subpath} would open a boundary it does not need`,
    );
  }
}

if (failures.length > 0) {
  console.error('The published surface does not add up:\n');
  for (const failure of failures) console.error(`  ${failure}`);
  console.error('\nRun `pnpm build` first, and review `exports` in package.json.');
  process.exit(1);
}

const subpaths = Object.keys(pkg.exports ?? {}).length;
console.log(
  `arrecife · ${subpaths} subpaths verified · the portable ones bring no React, ` +
    `and "use client" is on the ${CLIENT_ENTRIES.length / 2} entries that render it`,
);
