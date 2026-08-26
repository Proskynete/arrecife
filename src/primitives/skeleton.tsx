import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';

/**
 * Sin pulso ni barrido: el sistema no anima. Un bloque en `surfaceRaised` ya
 * comunica «aquí va a haber algo» sin pedirle atención al ojo.
 */
export function Skeleton({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      aria-hidden="true"
      className={cn('rounded-chip bg-surface-raised', className)}
      {...props}
    />
  );
}
