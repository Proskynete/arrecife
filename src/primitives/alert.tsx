import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '../lib/cn.ts';

const alert = cva(
  'w-full rounded-card border p-md font-sans text-ui',
  {
    variants: {
      variant: {
        neutral: 'border-border bg-surface text-text-secondary',
        success: 'border-success/40 bg-surface text-text-secondary',
        warning: 'border-warning/40 bg-surface text-text-secondary',
        error: 'border-error/40 bg-surface text-text-secondary',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
);

const tituloColor = {
  neutral: 'text-text-primary',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
} as const;

export type AlertProps = Omit<ComponentPropsWithoutRef<'div'>, 'title'> &
  VariantProps<typeof alert> & {
    title?: ReactNode;
    /** Glifo SVG a la izquierda del título. */
    icon?: ReactNode;
  };

export function Alert({ className, variant, title, icon, children, ...props }: AlertProps) {
  const tono = variant ?? 'neutral';

  return (
    <div
      role={tono === 'error' ? 'alert' : 'status'}
      className={cn(alert({ variant }), className)}
      {...props}
    >
      {title ? (
        <p className={cn('gap-xs mb-xs flex items-center font-medium', tituloColor[tono])}>
          {icon}
          {title}
        </p>
      ) : null}
      {children ? <div className="max-w-measure">{children}</div> : null}
    </div>
  );
}
