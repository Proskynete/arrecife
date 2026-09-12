/**
 * The pending actions on the identity documents, collected and printed.
 *
 * `docs/decisions/` is where a discrepancy between the code and a Claude Design
 * canvas gets recorded, and most entries end in **Action in the document** — a
 * change somebody has to make on the canvas, which lives outside this repo.
 * Nothing lists them, so an action is only as durable as whoever last read the
 * entry it is buried in.
 *
 * It reads every `*.md` in that folder EXCEPT `README.md`, which is the index
 * and holds no entries of its own. One file is one decision, named for its
 * number — `045-signature-halo.md` — and the number is zero-padded to three
 * digits precisely so that sorting the names sorts the log. That is why this
 * script no longer sorts: `readdir` plus the padding already does it, and the
 * hand-rolled numeric comparison it used to need existed only because `0.10`
 * sorts before `0.6` as a string and would have reordered the report silently.
 *
 * § 22 is the proof. It asked for `icon-sm 32×32` in the controls table in
 * August; the code has had the size since, and thirteen entries later an audit
 * found the canvas still listing four. Nobody ignored it — nobody re-read § 22.
 *
 * IT REPORTS, IT DOES NOT ENFORCE, and that is not a compromise. The actions
 * land on a canvas this script cannot open: it can say what is outstanding, and
 * it cannot say whether it was done. So it always exits 0, and it goes in the
 * `check:` family for the name rather than for the gate — the value is that the
 * list is printed by something that runs, instead of sitting in the middle of a
 * 1400-line file.
 *
 * The only thing it CAN fail on is its own contract: an entry with no «Action in
 * the document» line at all. That is a real omission — the section exists to
 * force the question «and what does the document have to say now», and «none» is
 * a valid answer that has to be written down. Twelve entries answer «none» today.
 */
import { readdir, readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const folder = join(root, 'docs', 'decisions');

const files = (await readdir(folder))
  .filter((name) => name.endsWith('.md') && name !== 'README.md')
  .sort();

if (files.length === 0) {
  console.error('docs/decisions/ holds no entry files.');
  process.exit(1);
}

const sources = new Map(
  await Promise.all(
    files.map(async (name) => [name, await readFile(join(folder, name), 'utf8')]),
  ),
);

/**
 * One file, one entry: its `# § N · Title` and everything under it.
 *
 * A file whose H1 is not that shape is a real failure and not something to skip
 * quietly — it means a file in this folder is not a decision, and the folder is
 * the log. It says which file, because «malformed heading» with 62 candidates
 * is not a message anybody can act on.
 */
const entries = files.map((name) => {
  const [first, ...rest] = sources.get(name).split('\n');
  const heading = /^# § (.+)$/.exec((first ?? '').trim())?.[1];
  if (!heading) {
    console.error(`${name} does not open with «# § N · Title».`);
    process.exit(1);
  }
  return { heading, body: rest.join('\n') };
});

const missing = [];
const pending = [];

for (const { heading, body } of entries) {
  const match = /\*\*Action in the document:\*\*\s*([\s\S]*?)(?=\n\n|\n---|$)/.exec(body);
  if (!match) {
    missing.push(heading);
    continue;
  }
  const action = (match[1] ?? '').replace(/\s+/g, ' ').trim();
  if (/^none\b/i.test(action) && !/^none,? but\b/i.test(action)) continue;
  pending.push({ heading, action });
}

if (pending.length > 0) {
  console.log(`\n${pending.length} actions are waiting on a canvas, not on this repo:\n`);
  for (const { heading, action } of pending) {
    console.log(`  § ${heading}`);
    console.log(`    ${action}\n`);
  }
}

if (missing.length > 0) {
  console.error(
    `\n${missing.length} entries have no «Action in the document» line, and that is not optional:\n`,
  );
  for (const heading of missing) console.error(`  § ${heading}`);
  console.error(
    '\nThe line exists to force the question «and what does the document have to say\n' +
      'now». «none» is a valid answer and it still has to be written down, because a\n' +
      'missing line and a deliberate «none» look identical six months later.',
  );
  process.exit(1);
}

const settled = entries.length - pending.length;
console.log(
  `arrecife · ${entries.length} decisions · ${pending.length} waiting on a document, ` +
    `${settled} settled. The canvases are the source; this repo cannot check them.`,
);
