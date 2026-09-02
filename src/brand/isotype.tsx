import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';
import { fins, ASSETS_PATH, type Background } from './catalog.ts';

export type IsotypeProps = Omit<ComponentPropsWithoutRef<'img'>, 'src' | 'alt'> & {
  /**
   * Which background it sits on. Deciding is mandatory even though it has a
   * default: the fin's body is nearly black, so the two-blue variant disappears
   * over abyss. Being a prop, the rule stops being something to remember.
   */
  background?: Background | undefined;
  basePath?: string | undefined;
  /** Alt text. Empty when the isotype accompanies text that already names it. */
  alt?: string | undefined;
};

export function Isotype({
  background = 'dark',
  basePath = ASSETS_PATH,
  alt = '',
  className,
  ...props
}: IsotypeProps) {
  const file = background === 'dark' ? fins.foam : fins.color;

  return (
    <img
      src={`${basePath}/${file}`}
      alt={alt}
      width={147}
      height={111}
      className={cn('h-8 w-auto select-none', className)}
      {...props}
    />
  );
}
