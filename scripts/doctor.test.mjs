/**
 * The doctor is checked against the two failures it was written for, both taken
 * from the real migration: the `@source` that was forgotten in `cursos`, and the
 * `--color-accent: var(--accent)` that a shadcn project brings with it and that
 * painted 88 classes inside the library's own components grey.
 *
 * It runs the CLI as a subprocess rather than importing it, because half of what
 * is being checked is the exit code and the other half is the text a human
 * reads: a check that fails without saying which line to add is the problem it
 * was written to solve.
 */
import { execFile } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, copyFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import { describe, expect, it } from 'vitest';

const run = promisify(execFile);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DOCTOR = resolve(root, 'scripts/doctor.mjs');

/** A project with the given stylesheet, and the package installed beside it. */
async function project(css, path = 'src/styles/globals.css') {
  const dir = await mkdtemp(join(tmpdir(), 'arrecife-doctor-'));
  const installed = join(dir, 'node_modules/@eduardoalvarez/arrecife/dist/tokens');

  await mkdir(installed, { recursive: true });
  await copyFile(resolve(root, 'dist/tokens/theme.css'), join(installed, 'theme.css'));

  await mkdir(join(dir, dirname(path)), { recursive: true });
  await writeFile(join(dir, path), css, 'utf8');

  return dir;
}

async function doctor(cwd) {
  try {
    const { stdout } = await run(process.execPath, [DOCTOR], { cwd });
    return { code: 0, out: stdout };
  } catch (error) {
    return { code: error.code, out: `${error.stdout}${error.stderr}` };
  }
}

const IMPORTS = `@import "tailwindcss";\n@import "@eduardoalvarez/arrecife/tokens/theme.css";\n`;

describe('arrecife doctor', () => {
  it('passes a project that has the @source and redefines nothing', async () => {
    const cwd = await project(
      `${IMPORTS}@source "../../node_modules/@eduardoalvarez/arrecife/dist";\n`,
    );
    const { code, out } = await doctor(cwd);

    expect(code).toBe(0);
    expect(out).toContain('@source is in place and no token is redefined');
  });

  it('catches the missing @source and works out the path from the SHEET', async () => {
    const { code, out } = await doctor(await project(IMPORTS));

    expect(code).toBe(1);
    // Two levels up, because the sheet is in `src/styles/` and not at the root.
    // Getting this wrong is most of why the line is written wrong by hand.
    expect(out).toContain('@source "../../node_modules/@eduardoalvarez/arrecife/dist"');
  });

  it('counts the levels from a sheet at the project root', async () => {
    const { out } = await doctor(await project(IMPORTS, 'app.css'));

    expect(out).toContain('@source "node_modules/@eduardoalvarez/arrecife/dist"');
  });

  it('catches the shadcn collision, and says which value wins', async () => {
    const css = `${IMPORTS}@source "../../node_modules/@eduardoalvarez/arrecife/dist";
@theme inline {
  --color-accent: var(--accent);
}
`;
    const { code, out } = await doctor(await project(css));

    expect(code).toBe(1);
    expect(out).toContain('redefines --color-accent');
    expect(out).toContain('var(--accent)');
    expect(out).toContain('#35D6C0');
  });

  it('does not fail on a collision where both sides agree', async () => {
    const css = `${IMPORTS}@source "../../node_modules/@eduardoalvarez/arrecife/dist";
@theme inline {
  --color-warm: #F2A65A;
}
`;
    const { code, out } = await doctor(await project(css));

    expect(code).toBe(0);
    expect(out).toContain('with the same value');
  });

  it('says nothing at all when the project does not use Tailwind', async () => {
    const { code, out } = await doctor(await project('.a { color: red; }\n'));

    expect(code).toBe(0);
    expect(out).toContain('Nothing to check');
  });
});
