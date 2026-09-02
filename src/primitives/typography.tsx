import { Slot } from '@radix-ui/react-slot';
import { type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ElementType } from 'react';

import { cn } from '../lib/cn.ts';

/**
 * The type scale as an API, not as loose classes.
 *
 * Four of the system's rules end up in here instead of in the head of whoever
 * is writing the view:
 *
 * 1. The family is bound to the scale. Display is «headlines and large numbers
 *    only, never body», so there is no way to ask for body in display: no
 *    `font` prop exists.
 * 2. Weight, line height and tracking come from the `--text-*` token. They are
 *    not exposed: changing them per component is how a scale comes undone.
 * 3. Body clamps to 68ch on its own. `measure` exists to switch that off when
 *    the text sits inside a cell or a narrow card, not as a preference.
 * 4. There are TWO mono scales, not one: `eyebrow` ships small caps and `meta`
 *    does not. Nearly all the mono in the system — dates, paths, versions, the
 *    footer signature — is `meta`. An eyebrow with `normal-case` on top is the
 *    sign that the wrong scale was picked.
 *
 * Semantics and style are independent on purpose: `as` picks the tag and
 * `variant` picks the scale. An `h2` that has to look small is
 * `<Text as="h2" variant="h3">`, not an `h3` that lies about the hierarchy.
 */

/** The default tag for each scale, when no `as` is passed. */
const LABEL = {
  display: 'h1',
  stat: 'p',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  body: 'p',
  lead: 'p',
  ui: 'p',
  label: 'span',
  tag: 'span',
  meta: 'p',
  chip: 'span',
  eyebrow: 'p',
} as const;

import { textVariants as text } from '../variants/typography.ts';

/** Allowed tags. The list is short on purpose: this is not a styled `div`. */
type Label =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'p'
  | 'span'
  | 'strong'
  | 'em'
  | 'figcaption'
  | 'caption'
  | 'legend'
  | 'dt'
  | 'dd'
  | 'li';

export type TextProps = Omit<ComponentPropsWithoutRef<'p'>, 'color'> &
  VariantProps<typeof text> & {
    /** HTML tag. Defaults to whichever one matches the scale. */
    as?: Label;
    /** Renders the child instead of creating an element, to wrap a link. */
    asChild?: boolean;
    /**
     * Clamps the line to 68ch. On by default for `body`, the only scale meant
     * to be read in long paragraphs.
     */
    measure?: boolean;
  };

export function Text({
  className,
  variant,
  tone,
  as,
  asChild = false,
  measure,
  children,
  ...props
}: TextProps) {
  const scale = variant ?? 'body';
  const clamp = measure ?? scale === 'body';
  const classes = cn(text({ variant, tone }), clamp && 'max-w-measure', className);

  if (asChild) {
    return (
      <Slot className={classes} {...props}>
        {children}
      </Slot>
    );
  }

  const Label = (as ?? LABEL[scale]) as ElementType;

  return (
    <Label className={classes} {...props}>
      {children}
    </Label>
  );
}

