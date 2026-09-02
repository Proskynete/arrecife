import * as LabelPrimitive from '@radix-ui/react-label';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';

export type LabelProps = ComponentPropsWithoutRef<typeof LabelPrimitive.Root>;

/**
 * The `label` scale: 13px, which is the system's absolute minimum on screen.
 *
 * It dims together with the control when that control is disabled, so the
 * label-control pair always reads as a single unit.
 */
export function Label({ className, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      className={cn(
        'text-label font-sans text-text-secondary select-none',
        'peer-disabled:opacity-50 group-data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    />
  );
}
