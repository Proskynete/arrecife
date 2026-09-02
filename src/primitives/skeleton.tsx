import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';

/**
 * A 1.4s linear sweep, from the document.
 *
 * It is the THIRD and last exception to «the system does not animate», alongside
 * the button spinner and the side panel. All three are feedback about PROGRESS
 * and not about state, which is the criterion: a block that is still and a block
 * that will never load look exactly the same, and the skeleton exists to say
 * «this is on its way», not «this is empty».
 *
 * It sits behind `motion-safe`, so it switches itself off for anyone who asked
 * for less motion — and what is left is the block on `surfaceRaised`, which
 * still communicates the shape of what is coming.
 *
 * `still` turns it off by hand, for long tables: twenty rows sweeping at once is
 * a strobe, not a load.
 */
export type SkeletonProps = ComponentPropsWithoutRef<'div'> & {
  /** Turns the sweep off. For long lists, where many at once are dizzying. */
  still?: boolean | undefined;
};

export function Skeleton({ className, still = false, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'rounded-chip bg-surface-raised',
        !still && 'motion-safe:shimmer',
        className,
      )}
      {...props}
    />
  );
}
