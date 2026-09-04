/**
 * The card's class vocabulary, with no React attached.
 *
 * `CARD_SURFACE` is the system's only definition of what a card surface is:
 * `surface`, `hairline` border, card radius. `CARD_HOVER` is rule 6 — the hover
 * changes the border and nothing else. `CARD` is the two of them plus what a
 * clickable card needs.
 *
 * They live here and not in `primitives/card.tsx` because `links` writes them by
 * hand: that project ships no framework JavaScript and cannot import a
 * component, so until now it copied the class list into its Astro. The copy had
 * already drifted once — the hero gradient sat at `55%` and `#e9eeea` against
 * the token's `60%` and `#EFE9DE`, and nothing compared them.
 */
export const CARD_SURFACE = 'rounded-card border-hairline bg-surface border';

/** Rule 6's hover: the border only. Applied where the card is clickable. */
export const CARD_HOVER = 'transition-standard hover:border-hairline-hover';

/**
 * The shared shell of the clickable cards — `ArticleCard`, `TalkCard`,
 * `CourseCard`, `LinkRow` — so rule 6 lives in exactly one place.
 *
 * «States are communicated with border and color, not with movement. A card's
 * hover changes the border from hairline to hairlineHover and nothing else.» No
 * scale, no elevation, no title displacement.
 */
export const CARD = [
  'group block cursor-pointer',
  CARD_SURFACE,
  CARD_HOVER,
  'focus-ring',
];
