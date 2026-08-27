import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';

/**
 * Barrido de 1.4s lineal, del documento.
 *
 * Es la TERCERA y última excepción a «el sistema no anima», junto al spinner del
 * botón y el panel lateral. Las tres son realimentación de PROGRESO y no de
 * estado, que es el criterio: un bloque quieto y un bloque que nunca va a cargar
 * se ven exactamente igual, y el skeleton existe para decir «esto viene en
 * camino», no «esto está vacío».
 *
 * Va detrás de `motion-safe`, así que se apaga solo para quien pidió menos
 * movimiento — y ahí queda el bloque en `surfaceRaised`, que sigue comunicando
 * la forma de lo que va a llegar.
 *
 * `still` lo apaga a mano, para las tablas largas: veinte filas barriendo a la
 * vez es un estroboscopio, no una carga.
 */
export type SkeletonProps = ComponentPropsWithoutRef<'div'> & {
  /** Apaga el barrido. Para listas largas, donde muchas a la vez marean. */
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
