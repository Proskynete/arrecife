import { cva } from 'class-variance-authority';

/**
 * The alert carries its color in the background, not only in the border.
 *
 * The system recipe is the semantic color at 8 % as background and at 22 % as
 * border. This file gave `bg-surface` to all four variants, so the tone lived
 * entirely in a 1px border: four alerts told apart by a line.
 *
 * All four tones start at ACCENT, which is the system's informational one (✦).
 * There is no `neutral`: an alert without color is a paragraph.
 *
 * MEASURED in both modes, because the document's 8 % is calculated over abyss
 * and it had to be checked that it survives over paper. Contrast of the tint
 * against the page background:
 *
 *              8 % dark    8 % light
 *   accent       1.149       1.106
 *   success      1.116       1.121
 *   warning      1.126       1.109
 *   error        1.067       1.120
 *
 * Light mode needs NO second table: it holds up as well as or better than dark.
 * The system's only weak point is `error` over abyss, 1.067, the faintest of the
 * eight tints, which leans entirely on the 22 % border.
 *
 * There is a SECOND recipe, deliberately: the alert under the newsletter form
 * goes to 10 % with a solid border so it reads under the field. That is
 * `emphasis="strong"`, and it is not merged with the subtle one because the
 * difference is documented.
 *
 * A THIRD contrast correction, in the line of the three `tokens.ts` already
 * carried. The title used to be in the semantic color, and in light mode that
 * cannot pass AA: the light semantics are calibrated to pass JUST over paper
 * (4.54–4.88), so over their own tint at 8 % they fall to 4.11–4.40. No alpha
 * fixes it — the problem is putting the color on top of itself.
 *
 * The tint is a SURFACE, so the text on top of it is a text token:
 * `textPrimary` gives 14.6–14.9 over all four tints. The semantic color stays
 * where it is not text — the border and the glyph — which is all the document
 * ever asked of it. The glyph is decorative and `aria-hidden`, so the 3:1
 * threshold applies to it rather than 4.5: its worst light case is 4.11.
 *
 * The radius: the document says 12, which is none of the system's five radii. It
 * uses the card radius rather than introducing a sixth — see
 * `docs/decisions.md`.
 */
const alert = cva('w-full rounded-card border p-step-md font-sans text-ui', {
  variants: {
    variant: {
      accent: 'text-text-secondary',
      success: 'text-text-secondary',
      warning: 'text-text-secondary',
      error: 'text-text-secondary',
    },
    emphasis: {
      subtle: '',
      strong: '',
    },
  },
  compoundVariants: [
    { variant: 'accent', emphasis: 'subtle', class: 'border-accent/22 bg-accent/8' },
    { variant: 'success', emphasis: 'subtle', class: 'border-success/22 bg-success/8' },
    { variant: 'warning', emphasis: 'subtle', class: 'border-warning/22 bg-warning/8' },
    { variant: 'error', emphasis: 'subtle', class: 'border-error/22 bg-error/8' },
    { variant: 'accent', emphasis: 'strong', class: 'border-accent bg-accent/10' },
    { variant: 'success', emphasis: 'strong', class: 'border-success bg-success/10' },
    { variant: 'warning', emphasis: 'strong', class: 'border-warning bg-warning/10' },
    { variant: 'error', emphasis: 'strong', class: 'border-error bg-error/10' },
  ],
  defaultVariants: { variant: 'accent', emphasis: 'subtle' },
});

export { alert as alertVariants };
