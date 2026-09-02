import { Slot } from '@radix-ui/react-slot';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '../lib/cn.ts';
import { CARD_HOVER, CARD_SURFACE } from '../primitives/card.tsx';

/**
 * The shared shell of the cards. It is not published: it exists so rule 6 lives
 * in exactly one place.
 *
 * «States are communicated with border and color, not with movement. A card's
 * hover changes the border from hairline to hairlineHover and nothing else.» No
 * scale, no elevation, no title displacement.
 */
export const CARD = [
  'group block cursor-pointer',
  CARD_SURFACE,
  CARD_HOVER,
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
];

export type CardShellProps = ComponentPropsWithoutRef<'a'> & {
  /**
   * Renders the child instead of an `<a>`. It is how Next's or Astro's `Link`
   * plugs in without the library depending on any router.
   */
  asChild?: boolean | undefined;
  children: ReactNode;
};

export function CardShell({ asChild = false, className, children, ...props }: CardShellProps) {
  const Root = asChild ? Slot : 'a';
  return (
    <Root className={cn(CARD, className)} {...props}>
      {children}
    </Root>
  );
}
