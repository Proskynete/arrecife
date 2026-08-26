import * as ProgressPrimitive from '@radix-ui/react-progress';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';

export type ProgressProps = ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
  /**
   * Nombre accesible de la barra. Es obligatorio a propósito: una barra de
   * progreso sin nombre no dice de qué es el progreso, y ninguna otra parte del
   * componente puede deducirlo.
   */
  label: string;
  /** Arena en vez de bioluz, para progreso de curso. */
  tone?: 'accent' | 'warm';
};

/**
 * El ancho del indicador cambia, no se anima: el sistema no anima escala ni
 * desplazamiento. `transition-standard` solo cubre color y borde, así que el
 * salto de ancho es inmediato aunque la clase esté puesta.
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
