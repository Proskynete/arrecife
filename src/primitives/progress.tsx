import * as ProgressPrimitive from '@radix-ui/react-progress';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';

export type ProgressProps = ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
  /**
   * The bar's accessible name. It is mandatory on purpose: a progress bar with
   * no name does not say what the progress is about, and no other part of the
   * component can deduce it.
   */
  label: string;
  /** Sand instead of biolume, for course progress. */
  tone?: 'accent' | 'warm';
};

/**
 * The indicator's width changes, it is not animated: the system animates neither
 * scale nor displacement. `transition-standard` only covers color and border, so
 * the width jump is immediate even with the class in place.
 */
export function Progress({ className, value, label, tone = 'accent', ...props }: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      className={cn('rounded-pill bg-surface-raised relative h-2 w-full overflow-hidden', className)}
      value={value}
      aria-label={label}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn('h-full', tone === 'warm' ? 'bg-warm' : 'bg-accent')}
        style={{ width: `${value ?? 0}%` }}
      />
    </ProgressPrimitive.Root>
  );
}
