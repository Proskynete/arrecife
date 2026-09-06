#!/usr/bin/env node
/**
 * `npx arrecife doctor` — the two failures a consuming project cannot see.
 *
 * Both were found by hand, in the same migration, and both cost hours because
 * neither produces an error. This is the check the backlog asked for.
 *
 * ONE · THE MISSING `@source`. Tailwind only generates the classes it can see,
 * and it does not look inside `node_modules`. Without the directive every class
 * the components emit is purged — `p-step-lg`, `rounded-card`, `border-hairline`
 * — and they render with no padding, no radius and no border. There is no
 * console error and no undefined class: the component mounts, simply undressed.
 * It is in the README and it was still forgotten, because until a project uses a
 * component and not just a token it does not need the line.
 *
 * AND THAT LAST CLAUSE IS THE CHECK, not a footnote to it. Importing the tokens
 * is not the same thing as rendering a component, and the first version treated
 * it as if it were: it asked `links` — which mounts no React at all, replicates
 * the pieces it needs in Astro and guards the replicas with `check:replica` — for
 * a directive that would have told Tailwind to generate every class in the
 * library. Measured, that took its stylesheet from 16 KB to 52 KB, all of it for
 * markup that does not exist in the project.
 *
 * So the directive is required only when the project imports something that
 * BRINGS MARKUP: the root barrel, `./brand`, `./social`, `./icons`, `./form` or
 * `./chart`. The portable subpaths do not — `./tokens` and `./theme` are values,
 * `./variants` hands back class strings that the project then writes into its
 * own files where Tailwind can see them, and `./social/data` is shapes. A
 * project living entirely on those gets told the line is not needed, which is a
 * different thing from not being told anything.
 *
 * TWO · THE TOKEN NAMESPACE COLLIDING WITH shadcn's. A project coming from
 * shadcn has `@theme inline { --color-accent: var(--accent); }`, and shadcn's
 * `--accent` is the hover SURFACE, `#17303E`, while this library's is the brand
 * turquoise, `#35D6C0`. The result was **88 classes inside the library's own
 * components** painting grey — 28 `text-accent`, 26 `outline-accent`, 15
 * `bg-accent`, 12 `border-accent`. Buttons, focus rings and badges came out the
 * colour of a surface, and it looked as though the migration had done nothing.
 *
 * Five names collide in total. Four are harmless because the two sides happen to
 * agree on the value, which is why the check reports the value on each side
 * instead of just the name: a collision that agrees is worth knowing about and
 * is not worth failing over.
 *
 * WHY A COMMAND AND NOT A README PARAGRAPH. Both of these WERE a README
 * paragraph. The whole reason this library exists is that a rule which is only
 * written down drifts, and a rule that fails silently drifts fastest.
 */
import { readdir, readFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const PACKAGE = '@eduardoalvarez/arrecife';
const here = dirname(fileURLToPath(import.meta.url));
const cwd = process.cwd();

const SKIP = new Set(['node_modules', '.git', '.next', 'dist', 'build', 'out', '.astro', 'coverage']);

async function* walk(dir, matches) {
  let items;
  try {
    items = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const item of items) {
    if (item.name.startsWith('.') && item.name !== '.') continue;
    const path = join(dir, item.name);
    if (item.isDirectory()) {
      if (SKIP.has(item.name)) continue;
      yield* walk(path, matches);
    } else if (matches(item.name)) {
      yield path;
    }
  }
}

const css = (dir) => walk(dir, (name) => name.endsWith('.css'));

/** Everything a bundler would look at for an import, plus the templates. */
const CODE = /\.(?:[cm]?[jt]sx?|astro|vue|svelte|mdx?)$/;

/**
 * The subpaths that carry no markup of ours, so importing one needs no `@source`.
 *
 * `./variants` is the one worth spelling out: it DOES hand back Tailwind classes,
 * and they still need no directive, because the project writes them into its own
 * files — `class={buttonVariants({ variant: 'tertiary' })}` in an `.astro` — and
 * that is a file Tailwind already scans. What `@source` buys is visibility into
 * `node_modules`, and nothing of ours renders there in this case.
 */
const CLASS_FREE = new Set([
  `${PACKAGE}/tokens`,
  `${PACKAGE}/tokens/theme.css`,
  `${PACKAGE}/theme`,
  `${PACKAGE}/variants`,
  `${PACKAGE}/social/data`,
  `${PACKAGE}/og`,
  `${PACKAGE}/shiki`,
  `${PACKAGE}/llms.txt`,
  `${PACKAGE}/package.json`,
]);

/** `from "x"`, `import "x"`, `require("x")` — the same net `check-package-exports` casts. */
const SPECIFIERS = /(?:\bfrom\s*|\bimport\s*|\brequire\(\s*)['"]([^'"]+)['"]/g;

/**
 * The first import of ours that brings markup with it, or `null`.
 *
 * It returns the import and not a boolean so the message can name it. «Add an
 * `@source`» is an instruction; «you import `Button` from the root, so add an
 * `@source`» is an explanation, and the difference decides whether somebody
 * pastes the line or understands when they need it.
 */
async function firstRendering() {
  for await (const file of walk(cwd, (name) => CODE.test(name))) {
    const source = await readFile(file, 'utf8');
    for (const [, specifier] of source.matchAll(SPECIFIERS)) {
      if (specifier !== PACKAGE && !specifier.startsWith(`${PACKAGE}/`)) continue;
      if (CLASS_FREE.has(specifier)) continue;
      if (specifier.startsWith(`${PACKAGE}/assets/`)) continue;
      return { file: relative(cwd, file), specifier };
    }
  }
  return null;
}

/** `--name: value;` pairs inside every `@theme` block of a stylesheet. */
function themeProperties(source) {
  const found = new Map();
  // `@theme`, `@theme inline`, `@theme static` — the modifier does not matter
  // for a name collision, only the name does.
  const blocks = source.matchAll(/@theme[^{]*\{([\s\S]*?)\n\}/g);
  for (const [, body] of blocks) {
    for (const [, name, value] of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
      found.set(name, value.trim());
    }
  }
  return found;
}

/** Our own published properties, read from the package rather than hardcoded. */
async function ours() {
  for (const candidate of [
    resolve(here, 'tokens/theme.css'), // published: dist/doctor.mjs beside dist/tokens/
    resolve(here, '../dist/tokens/theme.css'), // in this repo, run from scripts/
  ]) {
    try {
      return themeProperties(await readFile(candidate, 'utf8'));
    } catch {
      /* try the next one */
    }
  }
  return new Map();
}

const problems = [];
const notes = [];

const theirs = await ours();
if (theirs.size === 0) {
  console.error(`arrecife · could not read ${PACKAGE}'s own theme.css. Run \`pnpm build\` first.`);
  process.exit(1);
}

let entries = 0;

/*
  Worked out BEFORE the stylesheets are read, and once: the answer is a fact
  about the project and not about the sheet, and the same sheet must not get two
  different verdicts because of the order the walk happened to take.
*/
const rendering = await firstRendering();

for await (const file of css(cwd)) {
  const source = await readFile(file, 'utf8');
  const shown = relative(cwd, file);

  // The entry sheet is the one that imports Tailwind. A partial that only holds
  // an `@theme` block is checked for collisions all the same.
  const isEntry = /@import\s+["']tailwindcss["']/.test(source);
  const importsTokens = source.includes(`${PACKAGE}/tokens/theme.css`);
  const hasSource = /@source\s+["'][^"']*@eduardoalvarez\/arrecife/.test(source);

  if (isEntry) entries += 1;

  if (isEntry && importsTokens && !hasSource) {
    if (rendering) {
      // The path is relative to the SHEET, not to the project root, which is the
      // part that gets written wrong: a sheet in `src/styles/` goes up three.
      const target = relative(dirname(file), join(cwd, 'node_modules', PACKAGE, 'dist'));
      problems.push(
        `${shown}\n` +
          `    imports ${PACKAGE}/tokens/theme.css and has no @source.\n` +
          `    ${rendering.file} imports ${rendering.specifier}, which renders our markup,\n` +
          `    so every class those components emit is being purged — silently. Add:\n\n` +
          `      @source "${target.split('\\\\').join('/')}";\n`,
      );
    } else {
      notes.push(
        `${shown} imports the tokens and has no @source, and does not need one: ` +
          `nothing in this project imports a subpath that renders our markup. ` +
          `Adding it would make Tailwind generate the whole library for markup that is not here.`,
      );
    }
  }

  for (const [name, value] of themeProperties(source)) {
    const mine = theirs.get(name);
    if (mine === undefined) continue;

    // A value that points at another property cannot be compared here, and it is
    // exactly the shape the shadcn collision takes.
    const indirect = value.includes('var(');
    const same = !indirect && value.toLowerCase() === mine.toLowerCase();

    if (same) {
      notes.push(`${shown} redefines ${name}, with the same value (${value}). Harmless.`);
      continue;
    }

    problems.push(
      `${shown}\n` +
        `    redefines ${name}, which ${PACKAGE} owns.\n` +
        `      yours:    ${value}${indirect ? '   ← points at another property, so it wins silently' : ''}\n` +
        `      arrecife: ${mine}\n` +
        `    Every class in the library that uses it takes YOUR value, including the\n` +
        `    ones inside the library's own components.\n`,
    );
  }
}

if (entries === 0) {
  console.log('arrecife · no stylesheet importing tailwindcss was found. Nothing to check.');
  process.exit(0);
}

for (const note of notes) console.log(`arrecife · note · ${note}`);

if (problems.length > 0) {
  console.error(`\narrecife · ${problems.length} thing(s) that fail without saying so:\n`);
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}

console.log(
  `arrecife · ${entries} stylesheet(s) checked · no class is being purged and no token is redefined`,
);
