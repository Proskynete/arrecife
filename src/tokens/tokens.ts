/**
 * Arrecife — the single source of the visual identity.
 *
 * THE CONSTRAINT THAT OUTRANKS EVERYTHING ELSE: this file imports nothing. Not
 * React, not components, not third-party CSS. It is consumed by the five
 * projects, by an OG generator running on Satori and by an Astro site that
 * never mounts React. The moment a token depends on a component, the library
 * has stopped being portable. `scripts/check-tokens-purity.mjs` verifies it on
 * every build.
 *
 * Contrast ratios here are MEASURED, not estimated. Do not nudge a hex so it
 * «looks better»: #0F8F80 (3.57:1) and #B4632A (3.95:1) were already corrected
 * for failing AA on paper. If you see them anywhere, they are wrong.
 *
 * A second correction, for the same reason. The identity document measured
 * everything against `background`, but `surfaceRaised` is the worst case in
 * BOTH modes: in light it is darker than the page, in dark it is lighter. It is
 * where menus and active tabs live, so it is where reading has to work.
 *
 *   textMuted light  #6B7480 → #626A75   4.24 → 4.90 over background
 *   warning   light  #9A6A12 → #8D6111   4.23 → 4.88 over background
 *   error     dark   #E05252 → #E15757   4.35 → 4.51 over surface
 *
 * All three keep their exact hue and saturation: only lightness moves, by one
 * to four points. Light `accent` and `warm` stay as they are — they pass over
 * background and over surface, and neither is a text color on surfaceRaised.
 */

/* ------------------------------------------------------------------ color */

/**
 * Dark mode (primary). Contrast measured against `background` #091319.
 */
export const dark = {
  background: '#091319', //          abyss · page background
  surface: '#10202B', //             trench · cards and panels
  surfaceRaised: '#17303E', //       current · menus, active tabs
  border: '#22414F', //              control borders
  hairline: '#1E3441', //            subtle dividers
  hairlineHover: '#2C4D5D', //       hairline on card hover
  textPrimary: '#EDF4F3', //         foam              16.84:1
  textSecondary: '#A7BCC4', //       haze               9.50:1
  textMuted: '#71919C', //           plankton           5.57:1  never under 13px
  accent: '#35D6C0', //              biolume           10.31:1  interactive
  accentHover: '#5FE3D1',
  accentOn: '#06171A', //            ink over biolume
  warm: '#F2A65A', //                sand               9.28:1  human and conversion
  warmHover: '#F7BB7D',
  warmOn: '#2A1605', //              ink over sand
  success: '#4FB477',
  warning: '#E8A33D',
  error: '#E15757', //                                 4.51:1 over surface
} as const;

/**
 * Light mode. Contrast measured against `background` #F6F2EA.
 * `background` is WARM white: never #FFF as the page background.
 */
export const light = {
  background: '#F6F2EA', //          paper
  surface: '#FFFFFF',
  surfaceRaised: '#EFE9DE',
  border: '#E6DFD2',
  hairline: '#EBE6DC',
  hairlineHover: '#D3C8B2', //       hairline on card hover
  textPrimary: '#0B1524', //                           16.40:1
  textSecondary: '#3D4B58',
  textMuted: '#626A75', //                             4.53:1 over surfaceRaised
  accent: '#0D7C6F', //              dark biolume       4.55:1
  accentHover: '#0C7466',
  accentOn: '#FFFFFF',
  warm: '#A65B27', //                dark sand          4.54:1
  warmHover: '#96511F',
  warmOn: '#FFF7EE',
  success: '#0F6B52',
  warning: '#8D6111', //                               4.51:1 over surfaceRaised
  error: '#C0392B',
} as const;

export const colors = { dark, light } as const;

/** Brand — identical in both modes. */
export const brand = {
  /** The mascot's body. 4.22:1 → FILL ONLY, NEVER text. */
  body: '#3E7CB1',
  /** Spot pattern. */
  spots: '#C2D7E7',
  /** Hull · outline, and the background of code blocks. */
  hull: '#0B1524',
} as const;

/* -------------------------------------------------------------- typography */

export const fonts = {
  /** Headlines and large numbers ONLY. Never body copy. */
  display: '"Bricolage Grotesque", ui-sans-serif, system-ui, sans-serif',
  /** Body and interface. */
  sans: '"Geist", ui-sans-serif, system-ui, sans-serif',
  /** Code, paths, labels, metadata, the CLI signature. */
  mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
} as const;

export const typeScale = {
  display: { family: 'display', size: 76, lineHeight: 0.96, weight: 800, tracking: '-0.035em' },
  /** Large metrics. Numbers, not prose: line height 1 and no descenders. */
  stat: { family: 'display', size: 46, lineHeight: 1, weight: 800, tracking: '-0.035em' },
  h1: { family: 'display', size: 44, lineHeight: 1.05, weight: 700, tracking: '-0.03em' },
  h2: { family: 'display', size: 30, lineHeight: 1.1, weight: 600, tracking: '-0.02em' },
  h3: { family: 'display', size: 25, lineHeight: 1.15, weight: 600, tracking: '-0.02em' },
  body: { family: 'sans', size: 18, lineHeight: 1.75, weight: 400 },
  /**
   * 17px. The large button, and the deck on interior pages.
   *
   * It earns its own step because the identity document uses it TWICE, in two
   * different pieces: «lg 15/30 r12» with 17px text, and «h1 44/700 · deck 17px
   * · context paragraph 15px». One use would not have justified splitting the
   * gap between `ui` (15) and `body` (18); two did.
   */
  lead: { family: 'sans', size: 17, lineHeight: 1.5, weight: 400 },
  ui: { family: 'sans', size: 15, lineHeight: 1.6, weight: 400 },
  label: { family: 'sans', size: 13, lineHeight: 1.5, weight: 500 },
  /**
   * The status-badge scale: sans 12.5/500, squared off.
   *
   * That is half a pixel below `label`, and this time the half pixel matters: a
   * status badge sits inside a table or next to a title, and at 13 it competed
   * with the text it accompanies. The document specifies 12.5 and it shows.
   */
  tag: { family: 'sans', size: 12.5, lineHeight: 1.4, weight: 500 },
  /**
   * The category and metric scale: mono 11.5.
   *
   * It breaks the floor set by `limits.minScreenPx`, deliberately. That floor
   * protects TEXT — what you read in a sentence — and a one-word pill is not
   * running text: it is a mark. Contrast is still measured and still passes AA
   * (plankton 5.57:1 over abyss), which is the part that is not negotiable.
   *
   * At 13 the three badge families grew past the size of a small button and
   * outweighed the title they accompany. See `docs/decisions.md`.
   */
  chip: { family: 'mono', size: 11.5, lineHeight: 1.4, weight: 400 },
  /**
   * Mono with NO transform: dates, paths, versions, file names, the footer
   * signature and metric labels. It is most of the mono in the system.
   *
   * It exists because `eyebrow` ships `uppercase` and that is not a preference
   * you can switch off: it IS the eyebrow scale. An `18 Aug 2026` in small caps
   * or a `pose-laptop-coffee.png` in all caps are wrong, and without this step
   * the only way out was a `normal-case` at every call site.
   *
   * The document says 12.5. This is 13 for the same reason `textMuted` was
   * corrected: `limits.minScreenPx` is 13 and plankton is «never under 13px».
   * This scale is exactly where muted metadata gets written, so putting it at
   * 12.5 would have made its most common use illegible by half a pixel.
   */
  meta: { family: 'mono', size: 13, lineHeight: 1.6, weight: 400 },
  eyebrow: { family: 'mono', size: 12, tracking: '0.12em', transform: 'uppercase' },
} as const;

/** Hard legibility limits. */
export const limits = {
  /** Absolute minimum on screen. */
  minScreenPx: 13,
  /** Absolute minimum in print. */
  minPrintPt: 12,
  /** Maximum body measure. */
  measure: '68ch',
} as const;

/* ---------------------------------------------------------- shape and rhythm */

export const radius = {
  chip: 6,
  control: 10,
  card: 14,
  panel: 16,
  pill: 999,
} as const;

/**
 * Controls, from the document: `sm 8/14 · md 12/22 · lg 15/30 · icon 42×42`.
 *
 * Only the horizontal padding and the icon button's square. Height comes from
 * the type scale, and there is a single radius for all three sizes: see
 * `docs/decisions.md`.
 *
 * They are not in `spacing` because they are not page rhythm: 14, 22 and 30 do
 * not compose with 8/12/16/26/40 and must not be offered as margins.
 */
export const control = {
  sm: 14,
  md: 22,
  lg: 30,
  /** Icon button: square, no text. */
  icon: 42,
} as const;

/**
 * Page rhythm. All five steps carry `step` in the name, and that is not
 * decoration: it is the fix for a bug that never surfaced anywhere.
 *
 * In Tailwind v4, `--spacing-*` does not only feed `p-*`, `m-*` and `gap-*`: it
 * also resolves `w-*`, `h-*`, `max-w-*`, `min-w-*`, `basis-*` and `size-*`, and
 * there it BEATS the `--container-*` scale. The steps used to be named `xs, sm,
 * md, lg, xl`, which are exactly the names of that scale, so any project that
 * imported `theme.css` ended up with `max-w-sm` worth 12px instead of 384px.
 * Nothing warned: not the build, not the types, not Storybook, not the suite —
 * the library does not use those utilities internally. It was found in
 * production, with a hero paragraph running one word per line.
 *
 * Redeclaring `--container-sm` does NOT fix it: `--spacing-*` wins resolution.
 * The only way out is for the library not to use those names.
 *
 * The prefix follows the pattern `control` already had: a named group inside
 * the `--spacing-*` namespace. `scripts/check-tokens-namespace.mjs` prevents
 * the relapse.
 *
 * `section` carries no prefix because it collides with nothing in Tailwind.
 */
export const spacing = {
  stepXs: 8,
  stepSm: 12,
  stepMd: 16,
  stepLg: 26,
  stepXl: 40,
  section: 96,
} as const;

export const size = {
  /** Navigation bar height. */
  nav: 64,
  /** Reading column width. */
  content: 760,
  /** Maximum page width. */
  wide: 1180,
} as const;

/**
 * The syntax highlighting palette.
 *
 * Straight from the document: «keywords sand, strings biolume, comments
 * plankton, identifiers foam», over hull. FOUR colors on purpose — the system
 * communicates with color and border, not with chromatic noise, so functions,
 * variables and types all land on foam.
 *
 * The code block is an island of dark theme in both modes (see `CodeBlock`), so
 * this palette has NO light counterpart: it always sits on hull.
 *
 * Contrast MEASURED over `brand.hull` #0B1524, all AA:
 *
 *   identifier  foam      16.42:1
 *   literal     biolume   10.05:1
 *   keyword     sand       9.05:1
 *   comment     plankton   5.43:1
 *   invalid     error      4.97:1
 *
 * `brand.body` (#3E7CB1) is NOT here: the system restricts it to fill, never
 * text, and it measures 4.2:1 in this context.
 *
 * Numeric and boolean literals ride with strings in biolume. The document does
 * not assign them, and grouping them with strings — all three are literals — is
 * more coherent than introducing a fifth color outside the palette.
 */
export const syntax = {
  /** The hull. It is the block background in both modes. */
  background: brand.hull,
  /** Identifiers, functions, types, variables. */
  identifier: dark.textPrimary,
  /** Strings, numbers, booleans, null. */
  literal: dark.accent,
  /** Keywords, control flow, `import`, `this`. */
  keyword: dark.warm,
  /** Comments and punctuation. */
  comment: dark.textMuted,
  /** `markup.deleted`, `invalid`. */
  invalid: dark.error,
} as const;

/**
 * The chart series palette. FOUR, for the same reason as the syntax palette:
 * the system communicates with color and border, not with chromatic noise.
 *
 * None of them is a new color. They are four that already exist in the identity
 * and that are told apart by HUE, not by lightness — teal, orange, blue and
 * grey — which is the only way they stay four distinct series for someone who
 * cannot tell socialLink from green. Picking biolume and `success` would have produced
 * two nearly identical greens in light mode.
 *
 * `brand.body` belongs here and not in syntax highlighting by the same rule
 * read the right way round: the system restricts it to FILL and never to text,
 * and a chart series is fill. It is identical in both modes because it is a
 * brand color.
 *
 * The threshold that applies is the graphical-object one, 3:1 against the
 * background, not the text one. Measured against `background`, all four clear
 * it in both modes with room to spare: the worst is `brand.body` over paper, at
 * 3.9:1.
 *
 * A fifth series is not added by inventing a hue. If a chart needs five
 * categories, either there are too many categories or they need an «other»
 * bucket: see `docs/decisions.md`.
 */
export const series = {
  dark: [dark.accent, dark.warm, brand.body, dark.textMuted],
  light: [light.accent, light.warm, brand.body, light.textMuted],
} as const;

/**
 * The only two gradient blocks in the system: the hero and the section panel
 * (newsletter). Without a token, the five projects each write them by hand,
 * slightly differently, which is exactly how an identity drifts apart.
 *
 * `deep` is the third stop of the dark gradient. It lives only in here: it is
 * neither a surface nor a text color, so it does not belong in the palette, and
 * a key in `dark` with no counterpart in `light` would be a token that lies in
 * light mode.
 *
 * The document only specifies the two dark gradients. The light ones are
 * composed from the light palette with the same angles and stops, so the hero
 * does not go flat in light mode. Still pending ratification in the document.
 */
const deep = '#0D2129';

export const gradient = {
  dark: {
    hero: `linear-gradient(160deg, ${dark.background} 60%, ${deep} 100%)`,
    section: `linear-gradient(150deg, ${dark.surface} 0%, ${deep} 100%)`,
    /** The one used by the article OG template. 145°, from the document. */
    og: `linear-gradient(145deg, ${dark.background} 55%, ${deep} 100%)`,
  },
  light: {
    hero: `linear-gradient(160deg, ${light.background} 60%, ${light.surfaceRaised} 100%)`,
    section: `linear-gradient(150deg, ${light.surface} 0%, ${light.surfaceRaised} 100%)`,
    og: `linear-gradient(145deg, ${light.background} 55%, ${light.surfaceRaised} 100%)`,
  },
} as const;

/** A single level. There is no elevation scale. */
export const shadow = {
  standard: '0 1px 2px rgba(0, 0, 0, 0.35)',
} as const;

/**
 * 150ms ease-out — color and border only.
 * The system animates neither position nor scale: states are communicated with
 * border and color, not with movement.
 */
export const motion = {
  duration: '150ms',
  easing: 'ease-out',
  properties: 'color, background-color, border-color, fill, stroke',
} as const;

/* ------------------------------------------------------------ voice and brand */

export const tagline = {
  /** Hero. */
  long: 'Ayudo a equipos de ingeniería a escalar con criterio',
  /** Header, one line. */
  short: 'Ayudo a equipos a escalar con criterio',
  /** LinkedIn. */
  en: 'Helping engineering teams scale with judgment',
} as const;

/**
 * The wordmark always reads «Eduardo Álvarez». The mascot is called Tiburoncín
 * and its name never appears inside the logo.
 */
export const naming = {
  wordmark: 'Eduardo Álvarez',
  mascot: 'Tiburoncín',
  /** The domain, for the footer CLI signature: `$ cd ~/eduardoalvarez.dev/2026`. */
  domain: 'eduardoalvarez.dev',
} as const;

export type ColorMode = keyof typeof colors;
export type ColorToken = keyof typeof dark;
export type BrandToken = keyof typeof brand;
export type FontToken = keyof typeof fonts;
export type TypeScaleToken = keyof typeof typeScale;
export type RadiusToken = keyof typeof radius;
export type ControlToken = keyof typeof control;
export type GradientToken = keyof typeof gradient.dark;
export type SyntaxToken = keyof typeof syntax;
export type SpacingToken = keyof typeof spacing;
export type SizeToken = keyof typeof size;
/** The index of a chart series: 0, 1, 2 or 3. */
export type SeriesToken = 0 | 1 | 2 | 3;
