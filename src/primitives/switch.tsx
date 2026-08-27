import * as SwitchPrimitive from '@radix-ui/react-switch';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';

export type SwitchProps = ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>;

/**
 * La perilla cambia de posición, pero no se anima al hacerlo: la posición es el
 * estado, no una transición. Lo único que transiciona es el color de la vía.
 */
export function Switch({ className, ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        'rounded-pill border-border bg-surface-raised inline-flex h-6 w-11 shrink-0 cursor-pointer items-center border',
        'transition-standard',
        'hover:border-hairline-hover',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        'disabled:pointer-events-none disabled:opacity-50',
        'data-[state=checked]:border-accent data-[state=checked]:bg-accent',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'rounded-pill bg-text-secondary pointer-events-none block size-4 translate-x-1',
          'data-[state=checked]:bg-accent-on data-[state=checked]:translate-x-6',
        )}
      />
    </SwitchPrimitive.Root>
  );
}
