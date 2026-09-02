import { type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';
import {
  badgeVariants as badge,
  categoryBadgeVariants as category,
  metricBadgeVariants as metric,
} from '../variants/badge.ts';

/**
 * Three badge families, three components. Why there are three shapes and not one
 * is in `variants/badge.ts`, next to the classes that make them.
 */

/* ----------------------------------------------------------------- status */

export type BadgeProps = ComponentPropsWithoutRef<'span'> & VariantProps<typeof badge>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badge({ variant }), className)} {...props} />;
}

/* ---------------------------------------------------------------- category */

export type CategoryBadgeProps = ComponentPropsWithoutRef<'span'> & {
  /** Selected filter: solid sand with ink on top. */
  active?: boolean | undefined;
};

export function CategoryBadge({ className, active = false, ...props }: CategoryBadgeProps) {
  return (
    <span
      data-active={active || undefined}
      className={cn(category({ active }), className)}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ metric */

export type MetricBadgeProps = ComponentPropsWithoutRef<'span'> & {
  /** Adds the hairline ring. By default a metric carries no box. */
  boxed?: boolean | undefined;
};

export function MetricBadge({ className, boxed = false, ...props }: MetricBadgeProps) {
  return (
    <span
      className={cn(metric, boxed && 'border-hairline px-step-sm py-0.5 border', className)}
      {...props}
    />
  );
}

