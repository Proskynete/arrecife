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

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));

/** The ones that cannot depend on React, with the reason written beside them. */
const PORTABLE = {
  './tokens': 'la consumen los cinco proyectos, Satori y un Astro sin React',
  './theme': 'lo consume un Astro que no monta React, y `themeScript` va inline en el <head>',
  './og': 'corre en un worker o en un script de build',
  './shiki': 'se consume desde astro.config.mjs',
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
      failures.push(`exports["${subpath}"] promete ${file} y no exists`);
    }
  }
}

for (const entry of pkg.files ?? []) {
  if (!(await exists(entry))) {
    failures.push(`files incluye "${entry}" y no exists`);
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

if (failures.length > 0) {
  console.error('The published surface does not add up:\n');
  for (const failure of failures) console.error(`  ${failure}`);
  console.error('\nRun `pnpm build` first, and review `exports` in package.json.');
  process.exit(1);
}

const subpaths = Object.keys(pkg.exports ?? {}).length;
console.log(
  `arrecife · ${subpaths} subpaths verified · the portable ones bring no React, chunks included`,
);
