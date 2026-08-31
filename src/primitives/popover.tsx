import * as PopoverPrimitive from '@radix-ui/react-popover';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;

/**
 * Radix le pone `role="dialog"` al contenido, y un diálogo sin nombre accesible
 * no le dice nada a quien navega con lector de pantalla. Por eso el tipo exige
 * uno de los dos: `aria-label` con el texto, o `aria-labelledby` apuntando al
 * título que ya se ve en pantalla. No se puede olvidar porque no compila.
 */
type Etiquetado =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-labelledby': string; 'aria-label'?: never };

export type PopoverContentProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> &
  Etiquetado;

/** Sin animación de entrada: aparece donde va a quedarse, como el resto. */
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
