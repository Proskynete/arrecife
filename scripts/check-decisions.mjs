/**
 * The pending actions on the identity documents, collected and printed.
 *
 * `docs/decisions.md` is where a discrepancy between the code and a Claude
 * Design canvas gets recorded, and most entries end in **Action in the
 * document** — a change somebody has to make on the canvas, which lives outside
 * this repo. Nothing lists them, so an action is only as durable as whoever last
 * read the entry it is buried in.
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
import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const file = join(root, 'docs', 'decisions.md');

const source = await readFile(file, 'utf8');

/** Split on the `##` headings, keeping the numbered entries and dropping the prose ones. */
const entries = source
  .split(/^## /m)
  .slice(1)
  .map((block) => {
    const [heading, ...rest] = block.split('\n');
    return { heading: (heading ?? '').trim(), body: rest.join('\n') };
  })
  .filter((entry) => /^\d/.test(entry.heading));

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
