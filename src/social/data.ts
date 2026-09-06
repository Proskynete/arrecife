/**
 * The social glyphs as DATA, with no React attached.
 *
 * It is the third time the library answers the same question, and the answer has
 * not changed: `./variants` publishes the class vocabulary so an `.astro` can
 * write `buttonVariants({ variant: 'tertiary' })`, and the brand catalogue
 * publishes the PNGs as `faces`, `poses` and `fins` so anybody can build the
 * path. Both exist because a consumer that mounts no React still consumes the
 * system — it copies instead of importing, and a copy is what goes stale.
 *
 * `links` is that consumer, and it is not an oversight in it: zero dependencies
 * on `react`, `react-dom` or `@astrojs/react`, four `.astro` components, and a
 * `check:replica` that fails the build when its class vocabulary drifts from the
 * package's. What it could not replicate was a shape, so `SocialGlyph.astro`
 * carried four `<path d="…">` pasted by hand — and `cursos` had six of them in
 * its footer until the version before this one. That is the exact failure this
 * library was built to stop, happening inside the library's own blind spot.
 *
 * So the shapes live HERE, in a module that imports nothing, and the React
 * components in `index.tsx` are drawn FROM this file. There is one description of
 * what a GitHub mark looks like, and two renderers for it. A change to a `d`
 * reaches the `.astro` and the `.tsx` in the same commit or it reaches neither.
 *
 * The shapes are structured and not a blob of markup, because both renderers
 * have to walk them: JSX needs elements and a string needs text, and neither is
 * derivable from the other without parsing. Three tags cover the catalogue —
 * `path`, `circle` and `rect` — and a fourth gets added when a glyph needs it,
 * which is a decision and not a refactor.
 *
 * Every glyph is ALSO exported on its own, next to the record that collects
 * them. That is what keeps `import { LinkedIn } from '…/social'` costing one
 * shape instead of ten: `index.tsx` references the individual consts, so a
 * bundler drops the nine it does not draw. Reach for `socialGlyphs` when you
 * want to iterate the catalogue, and know that iterating it is asking for all of
 * it.
 *
 * See `docs/decisions.md` § 42.
 */

/** The stroke width of a functional glyph, from the document. */
export const SOCIAL_STROKE_WIDTH = 1.6;

/** The grid every glyph is drawn on. */
export const SOCIAL_VIEW_BOX = '0 0 24 24';

/**
 * One drawn element of a glyph.
 *
 * `solid` fills the shape with `currentColor` and drops the stroke. It exists for
 * exactly one case and it is not a loophole: `Rss`'s dot is a filled disc inside
 * an otherwise stroked glyph, because a 1.6 ring at 19px reads as a smudge.
 */
export type SocialGlyphShape =
  | { readonly tag: 'path'; readonly d: string; readonly solid?: true }
  | {
      readonly tag: 'circle';
      readonly cx: number;
      readonly cy: number;
      readonly r: number;
      readonly solid?: true;
    }
  | {
      readonly tag: 'rect';
      readonly x: number;
      readonly y: number;
      readonly width: number;
      readonly height: number;
      readonly rx: number;
    };

/**
 * How a glyph is drawn, which in this system is a rule and not a style.
 *
 * `brand` is a solid silhouette, because the shape belongs to somebody else and
 * the GitHub mark does not exist in outline. `functional` is a 1.6 stroke,
 * because there is no owner to be faithful to and the system draws its own
 * symbols with a line. A row mixing the two is normal, not a mistake: the blog's
 * footer already does it with `Email` and `Rss`.
 */
export type SocialGlyph = {
  readonly kind: 'brand' | 'functional';
  readonly shapes: readonly SocialGlyphShape[];
};

/* ------------------------------------------------------------------ brands */

/** GitHub's mark. Brand, so it is a solid silhouette. */
export const gitHubGlyph: SocialGlyph = {
  kind: 'brand',
  shapes: [
    {
      tag: 'path',
      d: 'M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.91c.58.1.79-.25.79-.55 0-.27-.01-1.18-.02-2.14-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.2.66.79.55A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z',
    },
  ],
};

/** LinkedIn's mark. Brand, so it is a solid silhouette. */
export const linkedInGlyph: SocialGlyph = {
  kind: 'brand',
  shapes: [
    {
      tag: 'path',
      d: 'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.71h.05a4.17 4.17 0 0 1 3.75-2.06c4.01 0 4.75 2.64 4.75 6.07V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21h-3.97V9Z',
    },
  ],
};

/** X's mark. Brand, so it is a solid silhouette. */
export const xGlyph: SocialGlyph = {
  kind: 'brand',
  shapes: [
    {
      tag: 'path',
      d: 'M17.53 3h3.06l-6.69 7.64L21.75 21h-6.16l-4.83-6.3L5.25 21H2.19l7.15-8.17L2.5 3h6.32l4.36 5.77L17.53 3Zm-1.07 16.17h1.7L7.62 4.74H5.8l10.66 14.43Z',
    },
  ],
};

/** Instagram's mark. Brand, so it is a solid silhouette. */
export const instagramGlyph: SocialGlyph = {
  kind: 'brand',
  shapes: [
    {
      tag: 'path',
      d: 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 3.68a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32Zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z',
    },
  ],
};

/** Discord's mark. Brand, so it is a solid silhouette. */
export const discordGlyph: SocialGlyph = {
  kind: 'brand',
  shapes: [
    {
      tag: 'path',
      d: 'M20.32 5.56A18.5 18.5 0 0 0 15.7 4.1a.07.07 0 0 0-.07.04c-.2.36-.42.82-.58 1.19a17 17 0 0 0-5.1 0c-.16-.38-.39-.83-.59-1.19a.07.07 0 0 0-.07-.04c-1.6.28-3.15.77-4.62 1.46a.06.06 0 0 0-.03.03C1.66 10 .9 14.28 1.28 18.5a.08.08 0 0 0 .03.05 18.6 18.6 0 0 0 5.6 2.84.07.07 0 0 0 .08-.03c.43-.59.81-1.21 1.14-1.86a.07.07 0 0 0-.04-.1c-.6-.23-1.18-.51-1.74-.83a.07.07 0 0 1-.01-.12l.35-.27a.07.07 0 0 1 .07-.01 13.3 13.3 0 0 0 11.3 0 .07.07 0 0 1 .08.01l.34.27c.04.04.04.1-.01.12-.55.33-1.13.6-1.74.83a.07.07 0 0 0-.04.1c.34.65.72 1.27 1.14 1.86a.07.07 0 0 0 .08.03 18.5 18.5 0 0 0 5.6-2.84.07.07 0 0 0 .04-.05c.45-4.88-.75-9.12-3.18-12.88a.06.06 0 0 0-.03-.03ZM8.4 15.93c-1.1 0-2.01-1.01-2.01-2.25 0-1.24.89-2.25 2.01-2.25 1.13 0 2.03 1.02 2.02 2.25 0 1.24-.9 2.25-2.02 2.25Zm7.22 0c-1.1 0-2.01-1.01-2.01-2.25 0-1.24.89-2.25 2.01-2.25 1.13 0 2.03 1.02 2.02 2.25 0 1.24-.89 2.25-2.02 2.25Z',
    },
  ],
};

/** YouTube's mark. Brand, so it is a solid silhouette. */
export const youTubeGlyph: SocialGlyph = {
  kind: 'brand',
  shapes: [
    {
      tag: 'path',
      d: 'M23.5 6.9a3 3 0 0 0-2.12-2.12C19.5 4.27 12 4.27 12 4.27s-7.5 0-9.38.51A3 3 0 0 0 .5 6.9 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.1 3 3 0 0 0 2.12 2.12c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3 3 0 0 0 2.12-2.12A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.1ZM9.6 15.6V8.4l6.24 3.6-6.24 3.6Z',
    },
  ],
};

/* -------------------------------------------------------------- functional */

/** The feed. Functional, so it is a 1.6 stroke — with one filled dot, because a ring that small reads as a smudge. */
export const rssGlyph: SocialGlyph = {
  kind: 'functional',
  shapes: [
    { tag: 'path', d: 'M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16' },
    { tag: 'circle', cx: 5, cy: 19, r: 1.6, solid: true },
  ],
};

/** The envelope. Functional, so it is a 1.6 stroke. */
export const emailGlyph: SocialGlyph = {
  kind: 'functional',
  shapes: [
    { tag: 'rect', x: 2.75, y: 4.75, width: 18.5, height: 14.5, rx: 2 },
    { tag: 'path', d: 'm3.5 7.5 7.4 5.2a2 2 0 0 0 2.2 0l7.4-5.2' },
  ],
};

export const newsletterGlyph: SocialGlyph = {
  kind: 'functional',
  shapes: [
    { tag: 'path', d: 'M18 8.5a6 6 0 1 0-12 0c0 5-2 6.5-2 6.5h16s-2-1.5-2-6.5' },
    { tag: 'path', d: 'M13.7 19a2 2 0 0 1-3.4 0' },
  ],
};

/**
 * «My other site», and the reason it is here rather than borrowed.
 *
 * The footer of `cursos` links to the personal site alongside six brand marks,
 * and a personal site is not a social network — none of the other nine fits. It
 * took Phosphor's `Globe`, which drew a correct globe with the wrong pen: the
 * catalogue draws functional glyphs at 1.6 on a 24 grid, and an outside set
 * carries its own weight and its own margins. The mismatch showed, and it was
 * reported so the set could gain one.
 *
 * So it is drawn to this catalogue's proportions: r 9.25 leaves the same 2.75 of
 * margin `Email`'s rectangle leaves, and the meridian's arc bulges to 37 % of
 * the sphere's half-width, which is what stops it from reading as a vertical
 * line at 19px. Circle, equator and meridian, and nothing else: a globe with
 * latitude lines turns into a grey disc at footer size.
 *
 * It is functional and not a brand for the same reason `Email` is: there is no
 * owner to be faithful to. A row that mixes it with GitHub and LinkedIn mixes a
 * stroke with two fills, which is the normal case and not a defect.
 */
export const websiteGlyph: SocialGlyph = {
  kind: 'functional',
  shapes: [
    { tag: 'circle', cx: 12, cy: 12, r: 9.25 },
    { tag: 'path', d: 'M2.75 12h18.5' },
    { tag: 'path', d: 'M12 2.75a14 14 0 0 1 0 18.5a14 14 0 0 1 0-18.5' },
  ],
};

/* ------------------------------------------------------------- the catalogue */

/**
 * The whole catalogue, keyed by the name each glyph is exported under in
 * `./social`.
 *
 * Reaching for this is asking for all ten shapes: it names every one of them, so
 * no bundler can drop the ones you do not draw. That is the right trade when you
 * are iterating a catalogue — a footer built from a config array — and the wrong
 * one when you want a single icon, which is what the loose consts above are for.
 */
export const socialGlyphs = {
  Discord: discordGlyph,
  Email: emailGlyph,
  GitHub: gitHubGlyph,
  Instagram: instagramGlyph,
  LinkedIn: linkedInGlyph,
  Newsletter: newsletterGlyph,
  Rss: rssGlyph,
  Website: websiteGlyph,
  X: xGlyph,
  YouTube: youTubeGlyph,
} as const satisfies Record<string, SocialGlyph>;

/** The name of a glyph in the catalogue. */
export type SocialName = keyof typeof socialGlyphs;

/** The ten names, in the order the catalogue declares them. */
export const socialNames = Object.keys(socialGlyphs) as readonly SocialName[];

/** `&`, `<`, `>` and `"` in an attribute value. The `d`s carry none, and a caller's `class` might. */
const escape = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const attributes = (pairs: Readonly<Record<string, string | number>>) =>
  Object.entries(pairs)
    .map(([key, value]) => ` ${key}="${escape(String(value))}"`)
    .join('');

const shapeMarkup = (shape: SocialGlyphShape) => {
  const solid = { fill: 'currentColor', stroke: 'none' };

  if (shape.tag === 'path') {
    return `<path${attributes({ d: shape.d, ...(shape.solid ? solid : {}) })}/>`;
  }
  if (shape.tag === 'circle') {
    return `<circle${attributes({
      cx: shape.cx,
      cy: shape.cy,
      r: shape.r,
      ...(shape.solid ? solid : {}),
    })}/>`;
  }
  return `<rect${attributes({
    x: shape.x,
    y: shape.y,
    width: shape.width,
    height: shape.height,
    rx: shape.rx,
  })}/>`;
};

/**
 * One glyph as a complete `<svg>` string, for a template that cannot mount React.
 *
 * It is the whole point of this module for `links`: an `.astro` writes
 * `<Fragment set:html={socialSvg('GitHub')} />` and stops maintaining a copy of
 * the shape. Everything the React component sets is set here too — the 1em box,
 * `currentColor`, `aria-hidden` — so the two renderings are the same drawing and
 * not two drawings that agree today.
 *
 * `aria-hidden` is the default because it is right in the only place these are
 * used: a glyph inside a link whose `aria-label` carries the accessible name.
 * Anything passed in `extra` overrides a default, including that one, and the
 * value is escaped — a `class` is the expected use and it arrives from the call
 * site.
 */
export function socialSvg(
  name: SocialName,
  extra: Readonly<Record<string, string | number>> = {},
): string {
  const glyph = socialGlyphs[name];

  const base =
    glyph.kind === 'brand'
      ? { fill: 'currentColor' }
      : {
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': SOCIAL_STROKE_WIDTH,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        };

  const open = attributes({
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: SOCIAL_VIEW_BOX,
    width: '1em',
    height: '1em',
    ...base,
    'aria-hidden': 'true',
    focusable: 'false',
    ...extra,
  });

  return `<svg${open}>${glyph.shapes.map(shapeMarkup).join('')}</svg>`;
}
