/**
 * Valida `release-please-config.json` contra el schema OFICIAL.
 *
 * It exists for one concrete and expensive reason: release-please **silently
 * ignores** keys it does not know. A misplaced `"component": ""` or
 * `"package-name"` raises no error, shows up in no log and does nothing — so the
 * configuration looks correct right up until the release fails to cut, and the
 * diagnosis turns into guesswork instead of reading.
 *
 * This check turns that silence into a build failure, the same way
 * `check-tokens-purity.mjs` does for token purity.
 *
 * What it does NOT validate: the values. Only that each key exists in the
 * schema, which is where all three real bugs were.
 *
 * With no network it warns and exits 0: it cannot be the check that breaks a
 * build because GitHub's CDN is down.
 */
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const config = JSON.parse(await readFile(resolve(root, 'release-please-config.json'), 'utf8'));

const url = config.$schema;
if (!url) {
  console.error('release-please-config.json declares no $schema. Add it.');
  process.exit(1);
}

let schema;
try {
  const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  schema = await response.json();
} catch (error) {
  console.warn(`arrecife · could not read the schema (${error.message}). Skipping.`);
  process.exit(0);
}

const rootKeys = Object.keys(schema.properties ?? {});
const packageKeys = Object.keys(schema.definitions?.ReleaserConfigOptions?.properties ?? {});

if (rootKeys.length === 0 || packageKeys.length === 0) {
  console.warn('arrecife · the schema changed shape and could not be read. Skipping.');
  process.exit(0);
}

const failures = [];

for (const key of Object.keys(config)) {
  if (key === '$schema') continue;
  if (!rootKeys.includes(key)) failures.push(`root · "${key}" does not exist in the schema`);
}

for (const [path, pkgConfig] of Object.entries(config.packages ?? {})) {
  for (const key of Object.keys(pkgConfig)) {
    if (!packageKeys.includes(key)) {
      failures.push(`packages["${path}"] · "${key}" does not exist in the schema`);
    }
  }
}

if (failures.length > 0) {
  console.error('release-please-config.json has keys release-please would ignore:\n');
  for (const failure of failures) console.error(`  ${failure}`);
  console.error(`\nThe schema is the authority: ${url}`);
  process.exit(1);
}

const total = Object.keys(config.packages ?? {}).length;
console.log(`arrecife · release-please-config.json valid · ${total} package(s)`);
