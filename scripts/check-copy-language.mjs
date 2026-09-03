/**
 * User-facing copy stays in Spanish, and nothing was checking it.
 *
 * `AGENTS.md` states the rule from both sides — identifiers, comments and story
 * names in English; anything a reader of a consuming site can see or hear in
 * Spanish — and the 0.6.0 rename swept twenty-one strings over the line anyway.
 * The reason it went unnoticed is that the result still LOOKS like code:
 *
 *   aria-label="Página next"                   ← a screen reader says this
 *   fieldLabel = 'Email electrónico'           ← «correo» with half the phrase gone
 *   title="Esta página no exists"              ← «existe» matched a rename pattern
 *   description="… ninguno con dueño declared."
 *
 * `pnpm test` did not catch any of them. axe checks that a control HAS an
 * accessible name, not which language it is in.
 *
 * WHAT IT LOOKS FOR, and why it is this and not a dictionary. The damage has one
 * shape: a string that is otherwise Spanish with an English word sitting inside
 * it. A string entirely in English is fine — story names and `Note` blocks are
 * documentation. A string entirely in Spanish is fine. The mix is the bug, and
 * it is a mix no human writes on purpose.
 *
 * Spanish is detected by an accent or by two of its function words, so a lone
 * `'Total'` or `'Error'` — the same word in both languages — never trips it. The
 * English list is short and closed on purpose: it holds the words a rename
 * actually reaches. A longer list would be a spellchecker, and a spellchecker
 * that cries wolf gets an `eslint-disable` written next to it within the week.
 */
import { readdir, readFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ROOTS = ['src', 'stories'];

/**
 * Two of these, or one accent, and the string is Spanish.
 *
 * `no`, `con` and `sin` are NOT here even though they are the most common words
 * on the list: all three are also English, and «No results, waiting state» and
 * «tertiary · for a header with no boxes» are English strings that the check has
 * no business reading as Spanish. Same principle as `color` below — a word that
 * belongs to both languages is evidence of neither.
 */
const SPANISH =
  /\b(el|la|los|las|un|una|de|del|que|para|por|se|te|tu|es|en|al|lo|su|ya|como|cada|esta|este|nada|hay|más|pero|cuando|donde|desde|hasta|sobre|entre)\b/gi;

const ACCENT = /[áéíóúñ¿¡]/;

/**
 * An accent settles it. Failing that, two function words do — or one, if the
 * string is long enough that one is not a coincidence.
 *
 * The one-word case is what catches `'Cambiar de theme'`, which has no accent
 * and only `de`. It is also the loosest rung on the ladder, which is why it asks
 * for three words: `'de'` alone in a two-word string is as likely to be a file
 * name as a sentence.
 */
function isSpanish(text) {
  if (ACCENT.test(text)) return true;
  const hits = (text.match(SPANISH) ?? []).length;
  if (hits >= 2) return true;
  return hits === 1 && text.trim().split(/\s+/).length >= 3;
}

/**
 * The words a rename reaches. Every one of them has a Spanish counterpart that a
 * find-and-replace would have taken, which is the only reason it is on the list.
 *
 * `color` and `error` are deliberately NOT on it: they are spelled the same in
 * both languages, so «Los estados se comunican con borde y color» would fail
 * forever and the check would be turned off within the week. A word that is
 * correct Spanish cannot be evidence of anything.
 */
const ENGLISH =
  /\b(exists?|declared|label|labels|theme|next|previous|email|name|title|value|size|width|height|loading|delete|cancel|save|search|filter|row|rows|item|items|list|state|group|content|header|footer|body|link|button|card|page|text|type|new|old|first|last|and|the|with|from|not|are|was|were)\b/i;

/**
 * Every string literal in the file.
 *
 * The length filter is applied AFTERWARDS, in the loop, and not in the pattern.
 * With `{6,160}` in the pattern the engine skips a short literal and then pairs
 * its closing quote with the next opening one, so
 *
 *   { variant: 'ui', detail: '15 / 1.6 · sans', example: 'Label de interfaz' }
 *
 * matched `', detail: '` and swallowed the boundaries of the string that
 * mattered. Matching every literal keeps the quotes paired; the filter belongs
 * where it costs nothing.
 */
const STRINGS = /'([^'\n\\]*)'|"([^"\n\\]*)"/g;

async function* walk(dir) {
  for (const item of await readdir(resolve(root, dir), { withFileTypes: true })) {
    const path = join(dir, item.name);
    if (item.isDirectory()) yield* walk(path);
    else if (/\.tsx?$/.test(item.name)) yield path;
  }
}

const failures = [];

for (const dir of ROOTS) {
  for await (const file of walk(dir)) {
    const source = await readFile(resolve(root, file), 'utf8');
    const lines = source.split('\n');

    for (const [index, line] of lines.entries()) {
      // A comment is documentation and goes in English, mixed or not.
      if (/^\s*(\/\/|\*|\/\*)/.test(line)) continue;

      for (const match of line.matchAll(STRINGS)) {
        const text = match[1] ?? match[2];
        if (text.length < 6 || text.length > 160) continue;
        if (!isSpanish(text)) continue;

        const english = text.match(ENGLISH);
        if (!english) continue;

        failures.push({ file, line: index + 1, text, word: english[0] });
      }
    }
  }
}

/**
 * The second rule, and it exists because the first one cannot see the case the
 * backlog actually reported: `aria-label="Volume"` is pure English, so there is
 * no Spanish left in the string for a mixed-language test to notice.
 *
 * It does not try to work out whether the neighbours are Spanish — «Volumen»,
 * «Cerrar» and «Silenciar» carry no accent and no function word, so that test
 * cannot see them either, and a rule that reads them as English would fire on
 * every correct file in the library.
 *
 * What it does instead is exact and boring: an accessible name that IS an
 * English UI word, whole and on its own. `aria-label="Volume"` is wrong here
 * whatever surrounds it, because the library's copy is Spanish by rule. The list
 * is the vocabulary of accessible names, which is small and closed — and none of
 * these words is also Spanish, so «Volumen», «Menú» and «Total» pass untouched.
 */
const ENGLISH_UI = new Set([
  'volume', 'mute', 'unmute', 'play', 'pause', 'stop', 'close', 'open',
  'back', 'forward', 'next', 'previous', 'search', 'settings', 'menu',
  'more', 'edit', 'delete', 'remove', 'add', 'save', 'cancel', 'submit',
  'copy', 'download', 'upload', 'share', 'expand', 'collapse', 'toggle',
  'select', 'filter', 'sort', 'refresh', 'retry', 'skip', 'rewind',
  'speed', 'progress', 'home', 'profile', 'notifications', 'loading',
]);

const ARIA = /aria-label=(?:"([^"\n]+)"|'([^'\n]+)')/g;

for (const dir of ROOTS) {
  for await (const file of walk(dir)) {
    const source = await readFile(resolve(root, file), 'utf8');

    for (const [index, line] of source.split('\n').entries()) {
      for (const match of line.matchAll(ARIA)) {
        const text = (match[1] ?? match[2]).trim();
        if (!ENGLISH_UI.has(text.toLowerCase())) continue;
        failures.push({ file, line: index + 1, text, word: text, aria: true });
      }
    }
  }
}

if (failures.length > 0) {
  console.error('User-facing copy that is not in the language of its neighbours:\n');
  for (const { file, line, text, word, aria } of failures) {
    console.error(`  ${relative('.', file)}:${line}`);
    console.error(`    ${text}`);
    console.error(
      aria
        ? `    an accessible name, and it is an English UI word — a screen reader says it out loud\n`
        : `    «${word}» is English, and the rest of the string is not\n`,
    );
  }
  console.error(
    'User-facing copy stays in Spanish: it is what a reader of a consuming site\n' +
      'sees, and what a screen reader says out loud. See «The language of the code»\n' +
      'in AGENTS.md. If the string really is meant to be English, it is documentation\n' +
      'and it should not be half in Spanish either.',
  );
  process.exit(1);
}

console.log(
  'arrecife · user-facing copy checked · no Spanish string carries an English word, ' +
    'and no accessible name is an English UI term',
);
