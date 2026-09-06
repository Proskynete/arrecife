/**
 * The footer's ten icons, and the footer's only.
 *
 * They live apart from `lib/glyphs.tsx` on purpose: that one is the minimum set
 * the primitives need and it does not grow; this is a third-party inventory that
 * will change when the social links change. Mixing them would have turned
 * `glyphs` into the icon library the system decided not to have.
 *
 * They live apart from `lib/` too, and that is the newer half: `lib/` is what is
 * NOT published, and anything with a subpath of its own gets a directory of its
 * own. These are published twice — loose from `./social` and grouped as `social`
 * from the root — and the difference is not cosmetic: this module renders React
 * but carries NO `"use client"`, so a Next Server Component can render an icon
 * without opening a client boundary for two `<svg>`. See `docs/decisions/`
 * § 26.
 *
 * The rule comes from the document, and it is a drawing rule, not a styling
 * one: BRANDS are solid (`fill`) and FUNCTIONAL icons use a 1.6 stroke. A brand
 * is its silhouette — the GitHub logo does not exist in outline — and a
 * functional icon is a symbol, which in this system is drawn with a line.
 *
 * WHAT IS DRAWN is no longer written here. The shapes come from `./data.ts`,
 * which imports nothing and is published at `@eduardoalvarez/arrecife/social/data`
 * for the consumer that mounts no React and used to paste the paths by hand.
 * This file is one of two renderers over that one description; the other builds a
 * string. A `d` that changes changes in both, in the same commit, or in neither.
 * See `docs/decisions/0.8.md` § 42.
 *
 * Each component names its own glyph const rather than reaching into the
 * catalogue record, and that is what keeps the import cheap: `import { LinkedIn }`
 * costs one shape, not ten.
 *
 * All of them measure 1em and inherit `currentColor`, so color and size come
 * from the context: in the footer, 19px in plankton with a hover to biolume.
 *
 * None carries visible text, so none carries a title inside the SVG: the
 * accessible name is supplied by the `aria-label` on the link wrapping them,
 * which is mandatory in `Footer`'s `SocialLink` type.
 */
import type { SVGProps } from 'react';

import {
  SOCIAL_STROKE_WIDTH,
  SOCIAL_VIEW_BOX,
  type SocialGlyph,
  type SocialGlyphShape,
  discordGlyph,
  emailGlyph,
  gitHubGlyph,
  instagramGlyph,
  linkedInGlyph,
  newsletterGlyph,
  rssGlyph,
  websiteGlyph,
  xGlyph,
  youTubeGlyph,
} from './data.ts';

/**
 * What every icon in this catalogue accepts, and it is exported for one concrete
 * reason: the grouped form exists so a project can ITERATE the catalogue, and
 * typing `Record<string, ComponentType<…>>` needs a name for the element.
 *
 * There is no `GitHubProps`: ten identical signatures under ten names inform
 * nobody, and the generator would print the same row ten times.
 */
export type SocialIconProps = SVGProps<SVGSVGElement>;

/** `Rss`'s dot: filled, because a 1.6 ring at 19px reads as a smudge. */
const SOLID = { fill: 'currentColor', stroke: 'none' } as const;

function drawShape(shape: SocialGlyphShape, index: number) {
  if (shape.tag === 'path') {
    return <path key={index} d={shape.d} {...(shape.solid ? SOLID : {})} />;
  }
  if (shape.tag === 'circle') {
    return (
      <circle key={index} cx={shape.cx} cy={shape.cy} r={shape.r} {...(shape.solid ? SOLID : {})} />
    );
  }
  return (
    <rect
      key={index}
      x={shape.x}
      y={shape.y}
      width={shape.width}
      height={shape.height}
      rx={shape.rx}
    />
  );
}

/**
 * The two pens, in one place, chosen by the glyph's own `kind` instead of by
 * whoever writes the component.
 *
 * It used to be two wrapper components — `Brand` and `Functional` — and picking
 * the wrong one was a one-word mistake that nothing would have caught. The kind
 * now travels with the shape, which is where it belongs: it is a fact about the
 * mark, not about this file.
 */
function Glyph({ glyph, ...props }: SocialIconProps & { glyph: SocialGlyph }) {
  const brand = glyph.kind === 'brand';

  return (
    <svg
      viewBox={SOCIAL_VIEW_BOX}
      width="1em"
      height="1em"
      fill={brand ? 'currentColor' : 'none'}
      {...(brand
        ? {}
        : {
            stroke: 'currentColor',
            strokeWidth: SOCIAL_STROKE_WIDTH,
            strokeLinecap: 'round' as const,
            strokeLinejoin: 'round' as const,
          })}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {glyph.shapes.map(drawShape)}
    </svg>
  );
}

/* ------------------------------------------------------------------ brands */

export const GitHub = (props: SocialIconProps) => <Glyph glyph={gitHubGlyph} {...props} />;

export const LinkedIn = (props: SocialIconProps) => <Glyph glyph={linkedInGlyph} {...props} />;

export const X = (props: SocialIconProps) => <Glyph glyph={xGlyph} {...props} />;

export const Instagram = (props: SocialIconProps) => <Glyph glyph={instagramGlyph} {...props} />;

export const Discord = (props: SocialIconProps) => <Glyph glyph={discordGlyph} {...props} />;

export const YouTube = (props: SocialIconProps) => <Glyph glyph={youTubeGlyph} {...props} />;

/* -------------------------------------------------------------- functional */

export const Rss = (props: SocialIconProps) => <Glyph glyph={rssGlyph} {...props} />;

export const Email = (props: SocialIconProps) => <Glyph glyph={emailGlyph} {...props} />;

/**
 * The newsletter. It plays the same role as `Rss` — a way to follow, not a
 * social network — which is why it belongs in this catalogue and does not open
 * the door to an icon library.
 *
 * It is named for what it means and not for what it draws, like everything else
 * in the system: it is a bell, and it is called `Newsletter`. `eduardoalvarez.dev`
 * had it drawn in the project, following the contract by hand so it would not
 * clash while it waited.
 */
export const Newsletter = (props: SocialIconProps) => <Glyph glyph={newsletterGlyph} {...props} />;

/**
 * «My other site»: the personal domain in a footer full of social networks.
 *
 * The tenth, and it got in by the same test as `Newsletter` rather than by being
 * useful: it is a way to reach the author, it is not a network, and every one of
 * the five projects has more than one domain. What it replaces is Phosphor's
 * `Globe` in the footer of `cursos` — a correct globe drawn with another set's
 * pen, in a row where the other six come from here.
 */
export const Website = (props: SocialIconProps) => <Glyph glyph={websiteGlyph} {...props} />;
