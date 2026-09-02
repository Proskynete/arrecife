/**
 * Generates `llms.txt` from `docs/llms.template.md` and from the types.
 *
 * It is the document an agent — Claude, Codex, Cursor — reads from a project
 * that installed the library. That agent never sees this repo: it sees
 * `node_modules/@eduardoalvarez/arrecife/`, which is why `llms.txt` travels in
 * the tarball. `AGENTS.md` is the other half, for the agent working in here.
 *
 * The inventory is NOT written by hand. A copied prop table drifts within two
 * versions and nobody notices, which is exactly the failure this repo already
 * fixed once with the palette. The prose lives in the template; the tables come
 * out of the TypeScript compiler, so they say what the code says.
 *
 * Only props DECLARED IN `src/` are listed. The ones a component inherits from
 * `<button>` or from Radix are summarised in the `Extends` line: enumerating
 * them would be a thousand rows of `onCopyCapture` that the agent already knows
 * and that bury the five that matter.
 *
 *   node scripts/build-llms.mjs            generates llms.txt
 *   node scripts/build-llms.mjs --check    fails if llms.txt is out of date
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import ts from 'typescript';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');

const TEMPLATE = resolve(root, 'docs/llms.template.md');
const TARGET = resolve(root, 'llms.txt');
const BRAND = '<!-- INVENTORY -->';

/** The `exports` entry points, with the subpath that publishes each. */
const ENTRIES = [
  { subpath: '.', file: 'src/index.ts' },
  { subpath: './tokens', file: 'src/tokens/index.ts' },
  { subpath: './theme', file: 'src/theme/index.ts' },
  { subpath: './variants', file: 'src/variants/index.ts' },
  { subpath: './brand', file: 'src/brand/index.ts' },
  { subpath: './og', file: 'src/og/index.ts' },
  { subpath: './shiki', file: 'src/shiki/index.ts' },
  { subpath: './form', file: 'src/form/index.tsx' },
  { subpath: './chart', file: 'src/chart/index.tsx' },
];

/**
 * Which directory each inventory section comes from, in order, and through which
 * entry it is reached.
 *
 * The first three hang off the root. `./form` and `./chart` do not: each lives
 * in its own subpath because each drags an OPTIONAL peer dependency — React Hook
 * Form and Recharts — and without their own `file` here their components would
 * drop out of the inventory with nothing warning about it.
 */
const SECTIONS = [
  {
    title: 'Primitives',
    dir: 'src/primitives/',
    file: 'src/index.ts',
    entry: '`@eduardoalvarez/arrecife`',
  },
  {
    title: 'Components',
    dir: 'src/components/',
    file: 'src/index.ts',
    entry: '`@eduardoalvarez/arrecife`',
  },
  {
    title: 'Brand',
    dir: 'src/brand/',
    file: 'src/index.ts',
    entry: '`@eduardoalvarez/arrecife` or `@eduardoalvarez/arrecife/brand`',
  },
  {
    title: 'Forms',
    dir: 'src/form/',
    file: 'src/form/index.tsx',
    entry: '`@eduardoalvarez/arrecife/form` · requires `react-hook-form`',
  },
  {
    title: 'Charts',
    dir: 'src/chart/',
    file: 'src/chart/index.tsx',
    entry: '`@eduardoalvarez/arrecife/chart` · requires `recharts`',
  },
];

const cfg = ts.readConfigFile(resolve(root, 'tsconfig.json'), ts.sys.readFile);
const options = ts.parseJsonConfigFileContent(cfg.config, ts.sys, root).options;
const program = ts.createProgram(
  ENTRIES.map((e) => resolve(root, e.file)),
  options,
);
const checker = program.getTypeChecker();

const path = (node) => relative(root, node.getSourceFile().fileName);

/** One line, no breaks or double spaces: markdown tables do not take them. */
const flat = (s) => s.replace(/\s+/g, ' ').trim();

/** The first paragraph of the JSDoc. The rest is the why, and it stays in the repo. */
const firstParagraph = (s) => flat(s.split(/\n\s*\n/)[0] ?? '');

const jsdoc = (symbol) =>
  ts.displayPartsToString(symbol.getDocumentationComment(checker));

/** Escapes what would break a cell: the pipe and the line break. */
const cell = (s) => flat(s).replace(/\|/g, '\\|');

/** Past this point a printed type stops informing and starts getting in the way. */
const MAX_LENGTH = 160;

/**
 * `Label` tells an agent nothing; `'h1' | 'h2' | …` does. The alias is expanded
 * only when the union is of literals: doing it for `ReactNode` prints half of
 * React's type library.
 */
function readableKind(kind) {
  const parts = kind.isUnion() ? kind.types : [kind];
  const helpers = parts.filter(
    (t) => !(t.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null)),
  );
  if (helpers.length === 0) return checker.typeToString(kind);

  const allLiterals = helpers.every((t) => t.isStringLiteral() || t.isNumberLiteral());
  const text =
    helpers.length > 1 && !allLiterals
      ? // A union of named types: printed exactly as the code wrote it.
        checker.typeToString(kind, undefined, ts.TypeFormatFlags.NoTruncation)
      : helpers
          .map((t) => checker.typeToString(t, undefined, ts.TypeFormatFlags.NoTruncation))
          .join(' | ');

  return compact(text, helpers.length === 1 ? helpers[0] : kind);
}

/**
 * `tokens` printed whole is four kilobytes of hexadecimals in a table cell. What
 * an agent needs from a token object are the NAMES: the values are already in
 * `theme.css`, and there it can read them without burying the rest of the
 * document.
 */
function compact(text, kind) {
  if (text.length <= MAX_LENGTH) return text;

  const properties = kind.getProperties?.() ?? [];
  if (properties.length === 0 || kind.getCallSignatures?.().length > 0) {
    return `${text.slice(0, MAX_LENGTH)}…`;
  }

  const keys = `{ ${properties.map((p) => p.getName()).join(', ')} }`;
  return keys.length <= text.length ? keys : `${text.slice(0, MAX_LENGTH)}…`;
}

/**
 * The `defaultVariants` of every `cva()` in the file, indexed by the name of the
 * variable it is assigned to. It is tied to the component through the variable
 * its body calls — `button({ variant })` — and not by guesswork: `badge.tsx`
 * declares two cvas, and attributing the wrong default would be worse than
 * printing none.
 */
function cvaDefaults(file) {
  const byVariable = new Map();

  const visit = (node) => {
    if (
      ts.isVariableDeclaration(node) &&
      node.initializer &&
      ts.isCallExpression(node.initializer) &&
      node.initializer.expression.getText() === 'cva' &&
      ts.isIdentifier(node.name)
    ) {
      {
        const config = node.initializer.arguments[1];
        const prop =
          config && ts.isObjectLiteralExpression(config)
            ? config.properties.find((p) => p.name?.getText() === 'defaultVariants')
            : undefined;
        const defaults = new Map();
        if (prop && ts.isPropertyAssignment(prop) && ts.isObjectLiteralExpression(prop.initializer)) {
          for (const d of prop.initializer.properties) {
            if (ts.isPropertyAssignment(d)) {
              defaults.set(d.name.getText(), d.initializer.getText().replace(/'/g, ''));
            }
          }
        }
        // In most files the cva's JSDoc IS the component's explanation: the why
        // behind the variants lives there and not above the function. It is kept
        // so it can be used when the function has none of its own.
        const symbol = checker.getSymbolAtLocation(node.name);
        byVariable.set(node.name.text, {
          defaults,
          doc: symbol ? firstParagraph(jsdoc(symbol)) : '',
        });
      }
    }
    ts.forEachChild(node, visit);
  };

  ts.forEachChild(file, visit);
  return byVariable;
}

/** The `= false` in the props destructuring, which is where the other default lives. */
function signatureDefaults(declaration) {
  const defaults = new Map();
  const param = declaration.parameters?.[0];
  if (!param || !ts.isObjectBindingPattern(param.name)) return defaults;

  for (const element of param.name.elements) {
    if (element.initializer) {
      const name = (element.propertyName ?? element.name).getText();
      defaults.set(name, element.initializer.getText().replace(/'/g, ''));
    }
  }
  return defaults;
}

/** The cva the component's body actually calls. */
function bodyCva(declaration, byVariable) {
  let found = null;
  const visit = (node) => {
    if (found) return;
    if (ts.isIdentifier(node) && byVariable.has(node.text)) {
      found = byVariable.get(node.text);
      return;
    }
    ts.forEachChild(node, visit);
  };
  if (declaration.body) visit(declaration.body);
  return found ?? { defaults: new Map(), doc: '' };
}

/** The JSDoc on the `XProps` alias, the third source when the other two are silent. */
function propsDoc(name, file) {
  let doc = '';
  const visit = (node) => {
    if (ts.isTypeAliasDeclaration(node) && node.name.text === `${name}Props`) {
      const symbol = checker.getSymbolAtLocation(node.name);
      if (symbol) doc = firstParagraph(jsdoc(symbol));
    }
    ts.forEachChild(node, visit);
  };
  ts.forEachChild(file, visit);
  return doc;
}

/**
 * What the props type hangs off, verbatim from the source. It is the line that
 * tells the agent `Button` also accepts `onClick` and `type` without having to
 * list the hundred-odd attributes of `<button>`.
 */
function propsBase(name, file) {
  let text = null;
  const visit = (node) => {
    if (ts.isTypeAliasDeclaration(node) && node.name.text === `${name}Props`) {
      text = node.type.getText();
    }
    ts.forEachChild(node, visit);
  };
  ts.forEachChild(file, visit);
  if (text === null) return null;

  // The `& { … }` of own props is stripped: those already appear in the table.
  const base = flat(text.replace(/&\s*\{[\s\S]*\}\s*$/, '').replace(/&\s*$/, ''));
  return base.length > 0 && base !== `${name}Props` ? base : null;
}

/** An exported component, with what it takes to document it. */
function readComponent(symbol) {
  const declaration = symbol.declarations?.find(
    (d) => ts.isFunctionDeclaration(d) || ts.isVariableDeclaration(d),
  );
  if (!declaration) return null;

  const file = declaration.getSourceFile();
  const kind = checker.getTypeOfSymbolAtLocation(symbol, declaration);
  const signature = kind.getCallSignatures()[0];
  if (!signature) return null;

  const fn = ts.isFunctionDeclaration(declaration) ? declaration : null;
  const cva = bodyCva(fn ?? {}, cvaDefaults(file));
  const defaults = new Map([
    ...cva.defaults,
    ...(fn ? signatureDefaults(fn) : []),
  ]);

  // Three places the explanation can live, ordered by closeness to the
  // component. The code uses all three, so the generator does too.
  const doc =
    firstParagraph(jsdoc(symbol)) ||
    cva.doc ||
    propsDoc(symbol.getName(), file);

  const props = [];
  const param = signature.getParameters()[0];
  if (param) {
    const propsType = checker.getTypeOfSymbolAtLocation(
      param,
      param.valueDeclaration ?? declaration,
    );
    for (const prop of propsType.getProperties()) {
      const d = prop.declarations?.[0];
      if (!d) continue;
      // The cut: only what is declared here. Inherited props go in `Extends`.
      if (!d.getSourceFile().fileName.startsWith(resolve(root, 'src'))) continue;

      props.push({
        name: prop.getName(),
        kind: readableKind(checker.getTypeOfSymbolAtLocation(prop, d)),
        optional: Boolean(prop.flags & ts.SymbolFlags.Optional),
        default: defaults.get(prop.getName()) ?? null,
        doc: firstParagraph(jsdoc(prop)),
      });
    }
  }

  return {
    name: symbol.getName(),
    file: path(declaration),
    doc,
    base: propsBase(symbol.getName(), file),
    props: props.sort((a, b) => a.name.localeCompare(b.name)),
  };
}

/** Everything an entry exports, already classified. */
function readEntry(entryFile) {
  const sf = program.getSourceFile(resolve(root, entryFile));
  const module = checker.getSymbolAtLocation(sf);
  const components = [];
  const values = [];
  const types = [];

  for (const symbol of checker.getExportsOfModule(module)) {
    const name = symbol.getName();
    const declaration = symbol.declarations?.[0];
    if (!declaration) continue;

    if (symbol.flags & (ts.SymbolFlags.TypeAlias | ts.SymbolFlags.Interface)) {
      types.push(name);
      continue;
    }

    const kind = checker.getTypeOfSymbolAtLocation(symbol, declaration);
    const isFunction = kind.getCallSignatures().length > 0;

    if (isFunction && /^[A-Z]/.test(name)) {
      const component = readComponent(symbol);
      if (component) components.push(component);
      continue;
    }

    values.push({
      name,
      file: path(declaration),
      kind: isFunction
        ? flat(checker.signatureToString(kind.getCallSignatures()[0]))
        : flat(readableKind(kind)),
      doc: firstParagraph(jsdoc(symbol)),
    });
  }

  return { components, values, types };
}

// ---------------------------------------------------------------- emission ---

const lines = [];
const write = (s = '') => lines.push(s);

/** Each entry is read once: reading it means compiling the whole program. */
const readEntries = new Map();
const entry = (file) => {
  if (!readEntries.has(file)) readEntries.set(file, readEntry(file));
  return readEntries.get(file);
};

for (const section of SECTIONS) {
  const dir = resolve(root, section.dir);
  const theirs = entry(section.file).components.filter((c) =>
    resolve(root, c.file).startsWith(dir),
  );
  if (theirs.length === 0) continue;

  write(`## ${section.title}`);
  write();
  write(`Imported from ${section.entry}. ${theirs.length} exports.`);
  write();

  // Grouped by file: `Dialog`, `DialogContent` and `DialogTitle` are one piece,
  // and splitting them alphabetically would turn them into three unrelated things.
  const byFile = new Map();
  for (const c of theirs) {
    if (!byFile.has(c.file)) byFile.set(c.file, []);
    byFile.get(c.file).push(c);
  }

  for (const [file, group] of [...byFile].sort()) {
    write(`### ${group.map((c) => c.name).join(', ')}`);
    write();
    write(`Source: \`${file}\``);
    write();

    for (const c of group) {
      if (group.length > 1) write(`**${c.name}**`);
      if (c.doc) {
        write(c.doc);
        write();
      }
      if (c.base) write(`- Extends: \`${cell(c.base)}\``);

      if (c.props.length === 0) {
        write('- No own props: it passes through those of the element or primitive it wraps.');
        write();
        continue;
      }

      write();
      write('| prop | type | req. | default | what it does |');
      write('| --- | --- | --- | --- | --- |');
      for (const p of c.props) {
        write(
          `| \`${p.name}\` | \`${cell(p.kind)}\` | ${p.optional ? '' : 'yes'} | ${
            p.default ? `\`${cell(p.default)}\`` : ''
          } | ${cell(p.doc)} |`,
        );
      }
      write();
    }
  }
}

write('## Exports that are not components');
write();
write(
  'The root re-exports everything from `./tokens` and `./brand` for convenience.',
);
write(
  'Each one appears exactly once, under the most specific subpath that publishes',
);
write(
  'it: if the code does not mount React, that subpath is the one to import.',
);
write();

// From the most specific to the root: that way `tokens` shows up under
// `./tokens` — the one Satori can consume — and not under the root, which drags
// React along.
const alreadyListed = new Set();
const sorted = [...ENTRIES].sort((a, b) => b.subpath.length - a.subpath.length);

for (const entry of sorted) {
  const { values, types } = readEntry(entry.file);
  const ownNames = values
    .filter((v) => !alreadyListed.has(v.name))
    .sort((a, b) => a.name.localeCompare(b.name));
  const ownTypes = types.filter((t) => !alreadyListed.has(t)).sort();

  for (const v of ownNames) alreadyListed.add(v.name);
  for (const t of ownTypes) alreadyListed.add(t);

  if (ownNames.length === 0 && ownTypes.length === 0) continue;

  const subpath = entry.subpath === '.' ? '' : entry.subpath.slice(1);
  write(`### \`@eduardoalvarez/arrecife${subpath}\``);
  write();

  if (ownNames.length > 0) {
    write('| export | type | what it is |');
    write('| --- | --- | --- |');
    for (const v of ownNames) {
      write(`| \`${v.name}\` | \`${cell(v.kind)}\` | ${cell(v.doc)} |`);
    }
    write();
  }

  if (ownTypes.length > 0) {
    write(
      `Types (${ownTypes.length}): ${ownTypes.map((t) => `\`${t}\``).join(', ')}.`,
    );
    write();
  }
}

const template = await readFile(TEMPLATE, 'utf8');
if (!template.includes(BRAND)) {
  console.error(`docs/llms.template.md has no ${BRAND} marker.`);
  process.exit(1);
}

/**
 * Strip absolute disk paths.
 *
 * TypeScript prints namespace re-exports — `export * as social from
 * './lib/social.tsx'` — as `typeof import("<absolute path>")`, so the file came
 * out carrying the path of the machine that generated it. Two problems, and the
 * second is the serious one:
 *
 *   1. `--check` could never pass off that machine. It failed in CI and passed
 *      locally, which is the worst way to fail.
 *   2. `llms.txt` TRAVELS IN THE PACKAGE. Publishing the folder structure of
 *      whoever built it gives an agent nothing and should not leave here.
 *
 * What remains is the repo-relative path, which is deterministic and is also the
 * useful one.
 */
const withoutDiskPaths = (text) => text.split(`${root}/`).join('').split(root).join('.');

const output = withoutDiskPaths(template.replace(BRAND, lines.join('\n').trimEnd()));

/**
 * The first differences between what is committed and what was generated.
 *
 * A check that only says «out of date» forces a blind regeneration just to find
 * out what changed — and if the thing failing is CI and not your laptop, not
 * even that helps. This prints the concrete lines, which is the only actionable
 * thing from a runner log.
 */
function firstDifferences(expected, found, howMany = 12) {
  const a = expected.split('\n');
  const b = found.split('\n');
  const output = [];

  for (let i = 0; i < Math.max(a.length, b.length) && output.length < howMany; i += 1) {
    if (a[i] === b[i]) continue;
    output.push(`  line ${i + 1}`);
    output.push(`    committed: ${a[i] === undefined ? '(does not exist)' : JSON.stringify(a[i])}`);
    output.push(`    generated: ${b[i] === undefined ? '(does not exist)' : JSON.stringify(b[i])}`);
  }

  if (a.length !== b.length) {
    output.push(`  total lines · committed ${a.length} · generated ${b.length}`);
  }

  return output.join('\n');
}

if (CHECK) {
  const current = await readFile(TARGET, 'utf8').catch(() => null);
  if (current !== output) {
    console.error(
      'llms.txt is out of date. It is generated from the types and the template:\n\n' +
        '  pnpm build:llms\n\n' +
        'This happens when a prop changes and nobody regenerates. It is the failure the file exists to prevent.\n',
    );
    if (current !== null) {
      console.error('First differences:\n');
      console.error(firstDifferences(current, output));
    }
    process.exit(1);
  }
  console.log('arrecife · llms.txt matches the types');
} else {
  await writeFile(TARGET, output, 'utf8');
  const components = [...readEntries.values()].reduce((n, e) => n + e.components.length, 0);
  console.log(
    `arrecife · llms.txt → ${relative(root, TARGET)} (${components} components, ${
      output.split('\n').length
    } lines)`,
  );
}
