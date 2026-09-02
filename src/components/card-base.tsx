import { Slot } from '@radix-ui/react-slot';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '../lib/cn.ts';
import { CARD } from '../variants/card.ts';

/**
 * The shared shell of the cards. The class list lives in `variants/card.ts`,
 * which brings no React, so `links` can read it instead of copying it.
 */

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
