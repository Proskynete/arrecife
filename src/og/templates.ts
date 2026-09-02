/**
 * The four Open Graph templates, 1200×630.
 *
 * They are NOT React components. They return the element tree Satori expects —
 * `{ type, props }` — built only from tokens and from the brand catalog, which
 * is pure data. This module can be imported from a worker, a build script or an
 * edge function without mounting anything.
 *
 * It is the case that justifies the `src/tokens/` constraint: if a token had
 * ended up depending on a component, this file would not exist.
 *
 * THERE IS ONE GRID, from the document: eyebrow on top, headline on the left,
 * signature at the bottom and the mascot anchored to the right. The only things
 * that change between templates are the background and which pose comes in.
 * Which is why there are not four layouts here: there is one, and three
 * parameters.
 *
 *   canvas    1200×630 · margin 64
 *   eyebrow   mono 20 · tracking 0.12em
 *   headline  display 800 · 58 · max 3 lines at 70 % of the width
 *   signature mono 21 · with the fin at 34
 *   mascot    anchored right · max height 430
 *
 * The default one is the declared exception: a two-column grid of its own with
 * the fin at 200 and a divider at x=290, and Geist 72/700 and 28/400 instead of
 * the display face. It is in the document as an exception, so it is here as a
 * separate function and not as an `if` inside the shared one.
 *
 * THE FIN IS NOT A PARAMETER. The document warns that «it is the easiest
 * mistake to make in a generator, because the background is a parameter»: foam
 * in the three dark templates, two blues in the course one. Here it is chosen by
 * the template's mode, the same way `Isotype` chooses it from `background`.
 * There is no way to ask for the bad combination.
 *
 * The headline truncates to 3 lines with an ellipsis and NEVER shrinks: a
 * headline at 44 and another at 58 in the same feed read as two different
 * brands.
 *
 * The images carry `alt=''`. Satori does not need it — it paints to SVG — but
 * the mascot and the fin ARE decorative here: what the card says is the
 * headline, and an OG's `alt` is set by the page's
 * `<meta property="og:image:alt">`. On top of that, the story mounts them as
 * real `<img>` elements and without `alt` they do not pass axe.
 *
 * Usage:
 *
 *   import satori from 'satori';
 *   import { articleTemplate, OG } from '@eduardoalvarez/arrecife/og';
 *
 *   const svg = await satori(articleTemplate({ title, category, readingMinutes }), {
 *     width: OG.width,
 *     height: OG.height,
 *     fonts: [...],
 *   });
 */
import { fins, faces, poses, ASSETS_PATH, type Face, type Pose } from '../brand/catalog.ts';
import { dark, fonts, gradient, light, naming, tagline, typeScale } from '../tokens/tokens.ts';

/* -------------------------------------------------------------------- types */

export type SatoriNode = {
  type: string;
  props: Record<string, unknown> & {
    style?: Record<string, string | number>;
    children?: Child | readonly Child[];
  };
};

type Child = SatoriNode | string | null | undefined | false;

/** The canvas and the grid. These are the production measurements. */
export const OG = {
  width: 1200,
  height: 630,
  margin: 64,
  /** The mascot's maximum height. */
  mascot: 430,
  /** The signature's fin. */
  signatureFin: 34,
  /**
   * The gap the column leaves when the pose goes on the left (course).
   *
   * It is 560 and not 420 because a full pose at 430 tall measures ~534 wide:
   * with the exact gap, the shark ate into the headline. The reserve is measured
   * by the pose's real width, not by the margin.
   */
  mascotReserve: 560,
} as const;

export type BaseData = {
  title: string;
  /**
   * Where the PNGs are served from. Satori does not read from disk: in a worker
   * this has to be an absolute URL or a `data:` URI.
   */
  basePath?: string | undefined;
};

/* ----------------------------------------------------------------- helpers */

function el(
  type: string,
  props: Record<string, unknown>,
  children?: Child | readonly Child[],
): SatoriNode {
  return { type, props: children === undefined ? props : { ...props, children } };
}

/**
 * Satori requires an explicit `display: flex` on any box with more than one
 * child: there is no block flow. This sets it once.
 */
function box(style: Record<string, string | number>, children?: Child | readonly Child[]) {
  return el('div', { style: { display: 'flex', ...style } }, children);
}

function text(style: Record<string, string | number>, content: string) {
  return el('div', { style: { display: 'flex', ...style } }, content);
}

/** The eyebrow: mono 20, small caps, 0.12em tracking. */
function eyebrow(content: string, color: string) {
  return text(
    {
      fontFamily: fonts.mono,
      fontSize: 20,
      letterSpacing: typeScale.eyebrow.tracking,
      textTransform: 'uppercase',
      color,
    },
    content,
  );
}

/**
 * The headline. Display 800 at 58, three lines and an ellipsis.
 *
 * `WebkitLineClamp` is what Satori understands for truncation; without it a long
 * title pushes the signature off the canvas.
 */
function headline(content: string, color: string) {
  return text(
    {
      fontFamily: fonts.display,
      fontSize: 58,
      fontWeight: 800,
      lineHeight: 1.06,
      letterSpacing: typeScale.h1.tracking,
      color,
      // 70 % of the CANVAS, not of the column. With the mascot in a column of
      // its own, a relative 70 % gave ~400px and the headline truncated mid-word.
      maxWidth: OG.width * 0.7,
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: 3,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    content,
  );
}

/** The signature: the fin at 34 and the text in mono 21. */
function signature(content: string, color: string, mode: 'dark' | 'light', base: string) {
  return box({ alignItems: 'center', gap: 14 }, [
    el('img', { alt: '',
      src: `${base}/${mode === 'dark' ? fins.foam : fins.color}`,
      height: OG.signatureFin,
      style: { height: OG.signatureFin },
    }),
    text({ fontFamily: fonts.mono, fontSize: 21, color }, content),
  ]);
}

/**
 * The shared grid. Three of the four templates are this with a different
 * background and a different mascot piece.
 */
function card(options: {
  mode: 'dark' | 'light';
  background: string;
  eyebrow: { text: string; color: string };
  title: string;
  /** A line under the headline, optional. */
  bajada?: string | undefined;
  signature: string;
  firmaColor: string;
  base: string;
  /** The right-hand piece, already assembled. */
  mascot?: SatoriNode | null | undefined;
  /** `curso` puts it on the left: it is the only one that inverts the grid. */
  mascotaIzquierda?: boolean | undefined;
  tinta: string;
  tintaSecundaria: string;
}): SatoriNode {
  /**
   * The mascot is ANCHORED to the edge, it does not occupy a column.
   *
   * That is what the document says — «anchored to the right», «bleeds off the
   * corner» — and it is also the only thing that lets the headline measure 70 %
   * of the canvas: with the mascot competing for width, the headline was left
   * with a third and got truncated mid-word. The headline takes the top band and
   * the mascot the bottom corner, so they do not collide.
   */
  const column = box(
    {
      position: 'relative',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '100%',
      height: '100%',
      padding: OG.margin,
      // When the pose goes on the left it needs the gap left for it: it is the
      // only thing that changes in the grid, and only the course template does it.
      paddingLeft: options.mascotaIzquierda ? OG.mascotReserve : OG.margin,
    },
    [
      eyebrow(options.eyebrow.text, options.eyebrow.color),
      box({ flexDirection: 'column', gap: 18 }, [
        headline(options.title, options.tinta),
        options.bajada
          ? text(
              {
                fontFamily: fonts.sans,
                fontSize: 26,
                color: options.tintaSecundaria,
                maxWidth: OG.width * 0.7,
              },
              options.bajada,
            )
          : null,
      ]),
      signature(options.signature, options.firmaColor, options.mode, options.base),
    ],
  );

  return box(
    {
      position: 'relative',
      width: OG.width,
      height: OG.height,
      backgroundImage: options.background,
      backgroundColor: options.mode === 'dark' ? dark.background : light.background,
      fontFamily: fonts.sans,
      overflow: 'hidden',
    },
    [
      options.mascot
        ? box(
            {
              position: 'absolute',
              bottom: 0,
              ...(options.mascotaIzquierda ? { left: 0 } : { right: 0 }),
              alignItems: 'flex-end',
            },
            options.mascot,
          )
        : null,
      column,
    ],
  );
}

function mascotPose(pose: Pose, base: string, height = OG.mascot) {
  return el('img', { alt: '', src: `${base}/${poses[pose]}`, height: height, style: { height: height } });
}

/* ------------------------------------------------------------- plantillas */

export type ArticleData = BaseData & {
  /** The category slug. It goes in sand, in small caps. */
  category?: string | undefined;
  readingMinutes?: number | undefined;
  /**
   * The face, «according to the text's tone». There is no default meant as
   * neutral: `hearts` is the one the manual assigns to the article OG.
   */
  expression?: Face | undefined;
};

/** Article · 145° gradient over abyss, category and reading time in sand. */
export function articleTemplate(data: ArticleData): SatoriNode {
  const base = data.basePath ?? ASSETS_PATH;
  const face = data.expression ?? 'hearts';
  const meta = [data.category, data.readingMinutes ? `${data.readingMinutes} min` : undefined]
    .filter(Boolean)
    .join(' · ');

  return card({
    mode: 'dark',
    background: gradient.dark.og,
    eyebrow: { text: meta || 'artículo', color: dark.warm },
    title: data.title,
    signature: naming.domain,
    firmaColor: dark.textSecondary,
    base,
    tinta: dark.textPrimary,
    tintaSecundaria: dark.textSecondary,
    mascot: el('img', { alt: '',
      src: `${base}/${faces[face]}`,
      height: 300,
      style: { height: 300, marginBottom: OG.margin, marginRight: OG.margin },
    }),
  });
}

export type CourseData = BaseData & {
  modules?: number | undefined;
  duration?: string | undefined;
  /** The footer's domain. The courses subdomain by default. */
  url?: string | undefined;
  pose?: Pose | undefined;
};

/**
 * Course · THE ONLY LIGHT TEMPLATE.
 *
 * Full pose on the left — it inverts the grid — eyebrow and URL in dark sand,
 * and therefore the two-blue fin. That last part is not decided here: it follows
 * from the mode being light.
 */
export function courseTemplate(data: CourseData): SatoriNode {
  const base = data.basePath ?? ASSETS_PATH;
  const meta = [data.modules ? `${data.modules} módulos` : undefined, data.duration]
    .filter(Boolean)
    .join(' · ');

  return card({
    mode: 'light',
    background: gradient.light.og,
    eyebrow: { text: 'nuevo curso', color: light.warm },
    title: data.title,
    bajada: meta || undefined,
    signature: data.url ?? `cursos.${naming.domain}`,
    firmaColor: light.warm,
    base,
    tinta: light.textPrimary,
    tintaSecundaria: light.textSecondary,
    mascotaIzquierda: true,
    mascot: mascotPose(data.pose ?? 'desk', base),
  });
}

export type TalkData = BaseData & {
  event?: string | undefined;
  year?: string | number | undefined;
  location?: string | undefined;
  summary?: string | undefined;
  pose?: Pose | undefined;
};

/** Talk · eyebrow in biolume with the event and year, pose bleeding off the corner. */
export function talkTemplate(data: TalkData): SatoriNode {
  const base = data.basePath ?? ASSETS_PATH;
  const head = ['charla', data.event, data.year].filter(Boolean).join(' · ');
  const footer = [data.location, data.event ? undefined : naming.domain].filter(Boolean).join(' · ');

  return card({
    mode: 'dark',
    background: 'none',
    eyebrow: { text: head, color: dark.accent },
    title: data.title,
    bajada: data.summary,
    signature: footer || naming.domain,
    firmaColor: dark.textSecondary,
    base,
    tinta: dark.textPrimary,
    tintaSecundaria: dark.textSecondary,
    // It bleeds: it runs off the bottom and the right, like a slide cover.
    mascot: el('img', { alt: '',
      src: `${base}/${poses[data.pose ?? 'surf']}`,
      height: 470,
      style: { height: 470, marginBottom: -46, marginRight: -36 },
    }),
  });
}

export type DefaultData = Omit<BaseData, 'title'> & {
  /** The name. The wordmark by default. */
  title?: string | undefined;
  description?: string | undefined;
};

/**
 * Default · the document's declared exception.
 *
 * A two-column grid of its own: the fin in biolume at 200 with a halo, a divider
 * at x=290 and Geist 72/700 and 28/400 — NOT the display face. It does not share
 * the shell with the other three because the document says the generator defines
 * it, not the table.
 */
export function defaultTemplate(data: DefaultData = {}): SatoriNode {
  const base = data.basePath ?? ASSETS_PATH;

  return box(
    {
      width: OG.width,
      height: OG.height,
      alignItems: 'center',
      backgroundColor: dark.background,
      fontFamily: fonts.sans,
    },
    [
      // The fin's column: 290 wide, which is where the divider falls.
      box(
        { width: 290, height: '100%', alignItems: 'center', justifyContent: 'center' },
        // The halo. A circle of biolume at 12 % behind the fin.
        box(
          {
            width: 260,
            height: 260,
            borderRadius: 999,
            backgroundColor: `${dark.accent}1F`,
            alignItems: 'center',
            justifyContent: 'center',
          },
          el('img', { alt: '', src: `${base}/${fins.foam}`, height: 200, style: { height: 200 } }),
        ),
      ),

      // The divider, exactly at x=290.
      box({ width: 1, height: 340, backgroundColor: dark.border }),

      box(
        { flexDirection: 'column', gap: 20, paddingLeft: OG.margin, paddingRight: OG.margin, flex: 1 },
        [
          text(
            { fontFamily: fonts.sans, fontSize: 72, fontWeight: 700, color: dark.textPrimary, lineHeight: 1.05 },
            data.title ?? naming.wordmark,
          ),
          text(
            { fontFamily: fonts.sans, fontSize: 28, fontWeight: 400, color: dark.textSecondary, lineHeight: 1.4 },
            data.description ?? tagline.short,
          ),
        ],
      ),
    ],
  );
}

/** The shared shell, in case a project needs a fifth template. */
export { card as plantillaBase };
