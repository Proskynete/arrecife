import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';

const badge = cva(
  [
    'inline-flex items-center gap-xs',
    'rounded-pill px-sm py-0.5',
    'font-mono text-eyebrow uppercase tracking-[0.12em]',
    'border transition-standard',
  ],
  {
    variants: {
      variant: {
        neutral: 'border-border bg-surface-raised text-text-secondary',
        accent: 'border-accent/40 bg-transparent text-accent',
        warm: 'border-warm/40 bg-transparent text-warm',
        success: 'border-success/40 bg-transparent text-success',
        warning: 'border-warning/40 bg-transparent text-warning',
        error: 'border-error/40 bg-transparent text-error',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
);

export type BadgeProps = ComponentPropsWithoutRef<'span'> & VariantProps<typeof badge>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badge({ variant }), className)} {...props} />;
}

export { badge as badgeVariants };
