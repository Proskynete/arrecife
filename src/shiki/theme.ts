/**
 * The system's highlighting theme, generated from `tokens.syntax`.
 *
 * It does NOT pull Shiki in as a dependency: it is a data object shaped the way
 * Shiki expects (`ThemeRegistration`). The three projects that highlight code
 * already do it at build time with their own tooling; what they were missing was
 * not a highlighter, it was the theme.
 *
 * It used to exist hand-written in
 * `eduardoalvarez.dev/src/settings/shiki-reef.ts`, and a `#E05252` had been left
 * inside it — precisely the hex `tokens.ts` says is wrong, corrected to
 * `#E15757` for contrast. It is the textbook case for why the palette cannot
 * live inside a project.
 *
 * Four colors and a red for invalid, all AA over hull. The scope list is
 * TextMate: if a new language paints something odd, the scope is added here and
 * it changes in all three projects at once.
 *
 * Usage in Astro:
 *
 *   import { arrecife } from '@eduardoalvarez/arrecife/shiki';
 *
 *   export default defineConfig({
 *     markdown: { syntaxHighlight: 'shiki', shikiConfig: { theme: arrecife } },
 *   });
 */
import { syntax } from '../tokens/tokens.ts';

/** The shape Shiki expects. Declared here so we need not depend on the package. */
export type ShikiTheme = {
  name: string;
  type: 'dark' | 'light';
  colors: Record<string, string>;
  tokenColors: readonly {
    scope: readonly string[];
    settings: { foreground?: string; fontStyle?: string };
  }[];
};

export const arrecife: ShikiTheme = {
  name: 'arrecife',
  type: 'dark',
  colors: {
    'editor.background': syntax.background,
    'editor.foreground': syntax.identifier,
  },
  tokenColors: [
    {
      scope: ['comment', 'punctuation.definition.comment', 'string.comment'],
      settings: { foreground: syntax.comment, fontStyle: 'italic' },
    },
    {
      scope: [
        'keyword',
        'keyword.control',
        'keyword.operator.new',
        'keyword.operator.expression',
        'storage',
        'storage.type',
        'storage.modifier',
        'meta.import keyword',
        'keyword.control.import',
        'keyword.control.from',
        'variable.language.this',
        'variable.language.super',
      ],
      settings: { foreground: syntax.keyword },
    },
    {
      scope: [
        'string',
        'string.quoted',
        'string.template',
        'punctuation.definition.string',
        'string.regexp',
        'constant.character.escape',
        'constant.numeric',
        'constant.language',
        'constant.language.boolean',
        'constant.language.null',
        'constant.language.undefined',
        'support.constant',
      ],
      settings: { foreground: syntax.literal },
    },
    {
      scope: [
        'entity.name.function',
        'support.function',
        'variable.function',
        'entity.name.type',
        'entity.name.class',
        'entity.name.namespace',
        'entity.other.inherited-class',
        'support.type',
        'support.class',
        'entity.name.tag',
        'variable',
        'variable.other',
        'variable.parameter',
        'meta.object-literal.key',
        'support.variable.property',
        'entity.other.attribute-name',
      ],
      settings: { foreground: syntax.identifier },
    },
    {
      scope: [
        'keyword.operator',
        'punctuation',
        'meta.brace',
        'punctuation.separator',
        'punctuation.terminator',
      ],
      settings: { foreground: syntax.comment },
    },
    { scope: ['markup.inserted'], settings: { foreground: syntax.literal } },
    {
      scope: ['markup.deleted', 'invalid', 'invalid.illegal'],
      settings: { foreground: syntax.invalid },
    },
    {
      scope: ['markup.heading', 'entity.name.section'],
      settings: { foreground: syntax.keyword, fontStyle: 'bold' },
    },
    { scope: ['markup.bold'], settings: { fontStyle: 'bold' } },
    { scope: ['markup.italic'], settings: { fontStyle: 'italic' } },
  ],
};

export default arrecife;
