/**
 * Stamps `"use client"` on the entries that render React, after tsup.
 *
 * WHY IT IS NEEDED. Radix's primitives call `createContext` at module scope. In
 * a Next project with the App Router, importing anything from the barrel from a
 * module a Server Component reaches evaluates that on the server, and there is
 * no client boundary stopping it:
 *
 *   TypeError: (0 , r.createContext) is not a function
 *   Failed to collect page data for /_not-found
 *
 * It blocked `cursos` for a whole version. The workaround was a `"use client"`
 * in every one of that project's own adapters — including a `Badge` that is a
 * `<span>` with no interaction — and it cost 272 KB of client chunk.
 *
 * WHY IT IS A SCRIPT AND NOT tsup's `banner`. It was tried. esbuild writes the
 * directive and the bundling pass strips it back out with a `Module level
 * directives cause errors when bundled` warning. The build stays green and the
 * published package is broken for Next, which is the worst way to fail: the
 * failure surfaces in somebody else's project. Prepending the line afterwards
 * cannot be silently undone.
 *
 * WHY ONLY THE ENTRIES. The directive marks a module boundary: whatever
 * `dist/index.js` imports becomes part of the client graph on its own. Stamping
 * the shared chunks too would drag the boundary into the portable subpaths that
 * happen to share one.
 *
 * WHY NOT ON THE PORTABLE ONES, which is the half that matters more.
 * `./tokens`, `./theme`, `./variants`, `./og` and `./shiki` bring no React.
 * Marking them client would be a lie with a cost: a Server Component importing
 * `buttonVariants` — a function that returns a string — would pull a client
 * boundary in with it. That is the whole reason `./variants` exists.
 *
 * IT IS INERT OUTSIDE NEXT. In Astro and in plain Vite the directive is a string
 * literal at the top of a module; Rollup may warn and nothing else happens. One
 * `dist` serves the Next projects and the Astro ones.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** The entries that render React. The rest of `exports` must NOT carry it. */
export const CLIENT_ENTRIES = [
  'dist/index.js',
  'dist/index.cjs',
  'dist/brand/index.js',
  'dist/brand/index.cjs',
  'dist/form/index.js',
  'dist/form/index.cjs',
  'dist/chart/index.js',
  'dist/chart/index.cjs',
];

export const DIRECTIVE = "'use client';";

// It only stamps when run as a script. Imported, it is just the list of entries
// — `check-package-exports.mjs` reads it so the two cannot drift apart.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const stamped = [];

  for (const entry of CLIENT_ENTRIES) {
    const path = resolve(root, entry);
    const source = await readFile(path, 'utf8');

    // Idempotent: running the build twice must not stack two directives.
    if (/^\s*(['"])use client\1;?/.test(source)) continue;

    await writeFile(path, `${DIRECTIVE}\n${source}`, 'utf8');
    stamped.push(relative(root, path));
  }

  console.log(
    `arrecife · "use client" on ${stamped.length || CLIENT_ENTRIES.length} entries` +
      `${stamped.length === 0 ? ' (already stamped)' : ''}`,
  );
}
