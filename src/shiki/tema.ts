/**
 * El tema de resaltado del sistema, generado desde `tokens.sintaxis`.
 *
 * NO trae Shiki como dependencia: es un objeto de datos con la forma que Shiki
 * espera (`ThemeRegistration`). Los tres proyectos que resaltan código ya lo
 * hacen en build con su propia herramienta; lo que les faltaba no era un
 * resaltador, era el tema.
 *
 * Existía escrito a mano en `eduardoalvarez.dev/src/settings/shiki-reef.ts`, y
 * ahí dentro se había quedado un `#E05252` — justo el hex que `tokens.ts` dice
 * que está mal, corregido a `#E15757` por contraste. Es el caso de libro de por
 * qué la paleta no puede vivir dentro de un proyecto.
 *
 * Cuatro colores y un rojo de invalidez, todos AA sobre casco. La lista de
 * scopes es TextMate: si un lenguaje nuevo pinta algo raro, se añade el scope
 * aquí y cambia en los tres proyectos a la vez.
 *
 * Uso en Astro:
 *
 *   import { arrecife } from '@eduardoalvarez/arrecife/shiki';
 *
 *   export default defineConfig({
 *     markdown: { syntaxHighlight: 'shiki', shikiConfig: { theme: arrecife } },
 *   });
 */
import { sintaxis } from '../tokens/tokens.ts';

/** La forma que Shiki espera. Se declara aquí para no depender del paquete. */
export type TemaShiki = {
  name: string;
  type: 'dark' | 'light';
  colors: Record<string, string>;
  tokenColors: readonly {
    scope: readonly string[];
    settings: { foreground?: string; fontStyle?: string };
  }[];
};

export const arrecife: TemaShiki = {
  name: 'arrecife',
  type: 'dark',
  colors: {
    'editor.background': sintaxis.fondo,
    'editor.foreground': sintaxis.identificador,
  },
  tokenColors: [
    {
      scope: ['comment', 'punctuation.definition.comment', 'string.comment'],
      settings: { foreground: sintaxis.comentario, fontStyle: 'italic' },
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
      settings: { foreground: sintaxis.palabraClave },
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
      settings: { foreground: sintaxis.literal },
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
      settings: { foreground: sintaxis.identificador },
    },
    {
      scope: [
        'keyword.operator',
        'punctuation',
        'meta.brace',
        'punctuation.separator',
        'punctuation.terminator',
      ],
      settings: { foreground: sintaxis.comentario },
    },
    { scope: ['markup.inserted'], settings: { foreground: sintaxis.literal } },
    {
      scope: ['markup.deleted', 'invalid', 'invalid.illegal'],
      settings: { foreground: sintaxis.invalido },
    },
    {
      scope: ['markup.heading', 'entity.name.section'],
      settings: { foreground: sintaxis.palabraClave, fontStyle: 'bold' },
    },
    { scope: ['markup.bold'], settings: { fontStyle: 'bold' } },
    { scope: ['markup.italic'], settings: { fontStyle: 'italic' } },
  ],
};

export default arrecife;
