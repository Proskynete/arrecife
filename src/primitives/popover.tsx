import * as PopoverPrimitive from '@radix-ui/react-popover';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;

/**
 * Radix puts `role="dialog"` on the content, and a dialog with no accessible
 * name says nothing to someone navigating with a screen reader. That is why the
 * type demands one of the two: `aria-label` with the text, or `aria-labelledby`
 * pointing at the title already visible on screen. It cannot be forgotten
 * because it does not compile.
 */
type Labelled =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-labelledby': string; 'aria-label'?: never };

export type PopoverContentProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> &
  Labelled;

/** No entrance animation: it appears where it will stay, like the rest. */
export function PopoverContent({
  className,
  align = 'center',
  sideOffset = 6,
  ...props
}: PopoverContentProps) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'z-50 w-72 p-step-md',
          'rounded-panel border-border bg-surface-raised shadow-standard border',
          'text-text-primary font-sans text-ui',
          'outline-none',
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}
