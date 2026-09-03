/**
 * Copies `doctor.mjs` into `dist/`, because `files` publishes `dist` and nothing
 * else — a `bin` pointing at `scripts/` would resolve to nothing in a consuming
 * project.
 *
 * It is a copy and not a tsup entry on purpose. `doctor.mjs` is a Node CLI with
 * no imports outside `node:`, so there is nothing to bundle; running it through
 * the bundler would only give it a chunk to depend on and a `dist/` name that
 * moves. It also has to keep its shebang, which esbuild strips.
 *
 * It runs AFTER tsup, like `build-tokens.mjs`, because `clean` wipes `dist/`.
 */
import { chmod, copyFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const target = resolve(root, 'dist/doctor.mjs');

await mkdir(dirname(target), { recursive: true });
await copyFile(resolve(root, 'scripts/doctor.mjs'), target);
// `npx arrecife` runs it directly, so it has to be executable and not merely
// readable. npm restores the bit on install, but a `pnpm pack` + local install
// does not always, and that is how this package gets verified.
await chmod(target, 0o755);

console.log('arrecife · doctor → dist/doctor.mjs');
