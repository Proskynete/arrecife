import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';

export type InputProps = ComponentPropsWithoutRef<'input'> & {
  /** Marca el control como inválido y tiñe el borde. */
  invalid?: boolean;
};

export function Input({ className, invalid = false, ...props }: InputProps) {
  return (
    <input
      data-invalid={invalid || undefined}
      aria-invalid={invalid || undefined}
      className={cn(
        'h-10 w-full px-step-sm',
        'rounded-control border border-border bg-surface',
        'font-sans text-ui text-text-primary placeholder:text-text-muted',
        'transition-standard',
        'hover:border-hairline-hover',
        'focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        'disabled:pointer-events-none disabled:opacity-50',
        'data-[invalid]:border-error data-[invalid]:focus-visible:outline-error',
        'file:mr-step-sm file:border-0 file:bg-transparent file:font-sans file:text-label file:text-text-secondary',
        className,
      )}
      {...props}
    />
  );
}
