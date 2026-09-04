import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';

export type TextareaProps = ComponentPropsWithoutRef<'textarea'> & {
  invalid?: boolean;
};

export function Textarea({ className, invalid = false, ...props }: TextareaProps) {
  return (
    <textarea
      data-invalid={invalid || undefined}
      aria-invalid={invalid || undefined}
      className={cn(
        'min-h-24 w-full px-step-sm py-step-xs',
        'rounded-control border border-border bg-surface',
        'font-sans text-ui text-text-primary placeholder:text-text-muted',
        'transition-standard',
        'hover:border-hairline-hover',
        'focus-visible:border-accent focus-ring',
        'disabled:pointer-events-none disabled:opacity-50',
        'data-[invalid]:border-error data-[invalid]:focus-visible:outline-error',
        className,
      )}
      {...props}
    />
  );
}
