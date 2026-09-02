/**
 * The constraint that outranks everything else, as a check rather than a
 * comment: `src/tokens/` imports nothing from outside `src/tokens/`.
 *
 * It is the only subpackage consumed by all five projects, by the Satori OG
 * generator and by an Astro site that never mounts React. The moment a token
 * depends on a component, the library has stopped being portable.
 */
import { readdir, readFile } from 'node:fs/promises';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dir = resolve(root, 'src/tokens');

const SPECIFIER = /(?:^|\n)\s*(?:import|export)\b[^\n;]*?\bfrom\s*['"]([^'"]+)['"]/g;
const DYNAMIC_IMPORT = /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
const REQUIRE = /\brequire\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

const failures = [];

for (const file of await readdir(dir, { recursive: true })) {
  if (!/\.(ts|tsx|mts|cts|js|mjs)$/.test(file)) continue;
  const path = resolve(dir, file);
  const source = await readFile(path, 'utf8');

  for (const pattern of [SPECIFIER, DYNAMIC_IMPORT, REQUIRE]) {
    pattern.lastIndex = 0;
    let m;
    while ((m = pattern.exec(source)) !== null) {
      const specifier = m[1];
      if (specifier.startsWith('.')) {
        // Relative: only allowed if it does not escape src/tokens/.
        const target = resolve(dirname(path), specifier);
        if (!relative(dir, target).startsWith('..')) continue;
      }
      failures.push(`${relative(root, path)} → ${specifier}`);
    }
  }
}

if (failures.length > 0) {
  console.error('src/tokens/ imported something from outside. The library is no longer portable:\n');
  for (const failure of failures) console.error(`  ${failure}`);
  console.error('\nTokens depend on neither React, nor components, nor third-party CSS.');
  process.exit(1);
}

console.log('arrecife · src/tokens/ clean: zero external dependencies');
