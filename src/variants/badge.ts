import { cva } from 'class-variance-authority';

/**
 * THREE badge families, not one.
 *
 * The system defines three distinct shapes and this file served all of them as a
 * mono pill in small caps. Each has its own shape because each says a different
 * thing:
 *
 *   category · pill r999, mono 11.5, sand      → a slug: `engineering-culture`
 *   status   · square r6, sans 12.5/500, tint  → a signal: published, draft
 *   metric   · pill, mono 11.5 muted           → a datum: `8 min read`
 *
 * NONE of them is small-capped. The `uppercase tracking-[0.12em]` all three used
 * to carry came from `text-eyebrow`, which is the eyebrow scale and not the
 * badge one: it turned `engineering-culture` into `ENGINEERING-CULTURE` and
 * `pose-laptop-coffee.png` into a file name that does not exist.
 */


/**
 * A signal. Square r6, sans 12.5/500 and the semantic color at 8 % as the
 * background — the alert recipe at word size: a status IS a one-word alert.
 *
 * NO border. It had one for a while, added to reinforce the tone, and it was
 * heavy: a bordered box next to a title reads as a control and not as a datum.
 * The tint alone is what the document asks for and it is what looks cleanest.
 *
 * The text is `textPrimary`, not the tone's color. In light mode the semantic
 * colors are calibrated to pass JUST over paper, so over their own tint they
 * fall to 4.10–4.40 and fail AA. The tint is a surface; what goes on top of it
 * is a text token. Measured in `alert.tsx`.
 *
 * The tone is never the only carrier of meaning: the label spells out
 * «Publicado» or «Borrador» in full.
 */
const badge = cva(
  ['inline-flex items-center gap-step-xs', 'rounded-chip px-step-xs py-0.5', 'font-sans text-tag', 'transition-standard'],
  {
    variants: {
      variant: {
        neutral: 'bg-surface-raised text-text-secondary',
        accent: 'bg-accent/8 text-text-primary',
        warm: 'bg-warm/8 text-text-primary',
        success: 'bg-success/8 text-text-primary',
        warning: 'bg-warning/8 text-text-primary',
        error: 'bg-error/8 text-text-primary',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
);

/* ---------------------------------------------------------------- category */

/**
 * A slug, in sand. Untransformed: slugs already arrive lowercase and forcing it
 * would be the same mistake the `uppercase` was making.
 *
 * The document's border is `#4A3A25`, which is sand at 28 % over abyss: it comes
 * out of the palette, so it does not enter as a new token. In light mode the
 * same rule gives dark sand at 28 % over paper, which is what is wanted.
 *
 * The filled variant is NOT decorative: it is the only indicator of the active
 * filter in the article listing. That is why `active` is a prop and not a
 * `className`.
 */
const category = cva(
  [
    'inline-flex items-center gap-step-xs',
    'rounded-pill px-step-sm py-0.5',
    'font-mono text-chip',
    'border transition-standard',
  ],
  {
    variants: {
      active: {
        false: 'border-warm/28 bg-transparent text-warm',
        true: 'border-warm bg-warm text-warm-on',
      },
    },
    defaultVariants: { active: false },
  },
);

/* ------------------------------------------------------------------ metric */

/**
 * A datum: reading minutes, number of modules, a file name.
 *
 * No color box and no transform. It is the family `brand.stories.tsx` was asking
 * for when it rendered `LAPTOP-COFFEE` for a file name that is actually
 * `pose-laptop-coffee.png`.
 */
const metric = ['inline-flex items-center gap-step-xs', 'rounded-pill', 'font-mono text-chip text-text-muted'];

export {
  badge as badgeVariants,
  category as categoryBadgeVariants,
  metric as metricBadgeVariants,
};
