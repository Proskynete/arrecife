import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

/**
 * Inverted on purpose: the document draws it «espuma sobre oscuro, texto casco
 * 13px/500 — se invierte a propósito para que destaque». `bg-text-primary` with
 * `text-background` is that inversion in both modes: foam on the abyss page in
 * dark, ink on paper in light. It is the one layer that does not sit on a
 * surface token, which is exactly what makes it read as a layer.
 */
export function TooltipContent({
  className,
  sideOffset = 6,
  ...props
}: ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          'z-50 px-step-sm py-step-xs',
          'rounded-chip bg-text-primary shadow-standard',
          'font-sans text-label text-background',
          className,
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
}
