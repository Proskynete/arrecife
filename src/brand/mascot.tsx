import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';
import { faces, poses, ASSETS_PATH, type Face, type Pose } from './catalog.ts';

type Base = Omit<ComponentPropsWithoutRef<'img'>, 'src' | 'alt'> & {
  basePath?: string | undefined;
  /**
   * Alt text. Empty by default: the mascot is illustration and the text beside
   * it already says what there is to know. Fill it in only when the image
   * carries information that is not written next to it.
   */
  alt?: string | undefined;
};

export type MascotProps = Base & { pose: Pose };

/** Full-body Tiburoncín. */
export function Mascot({
  pose,
  basePath = ASSETS_PATH,
  alt = '',
  className,
  ...props
}: MascotProps) {
  return (
    <img
      src={`${basePath}/${poses[pose]}`}
      alt={alt}
      className={cn('h-auto w-full max-w-64 select-none', className)}
      {...props}
    />
  );
}

export type MascotFaceProps = Base & { expression: Face };

/**
 * Tiburoncín's head, with an expression.
 *
 * Faces go ONLY in empty states, confirmations, errors, course progress and
 * celebration. Never in a hero, pricing, services, contact or CV. That is why
 * `EmptyState` takes a face and `PageHeader` does not: the rule is not written
 * in a guide you have to remember, it is written into which components accept
 * one.
 */
export function MascotFace({
  expression,
  basePath = ASSETS_PATH,
  alt = '',
  className,
  ...props
}: MascotFaceProps) {
  return (
    <img
      src={`${basePath}/${faces[expression]}`}
      alt={alt}
      className={cn('h-auto w-full max-w-24 select-none', className)}
      {...props}
    />
  );
}
