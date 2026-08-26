import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';
import { naming } from '../tokens/tokens.ts';
import { Isotipo } from './isotipo.tsx';
import { RUTA_ASSETS, type Fondo } from './catalogo.ts';

export type LogoProps = Omit<ComponentPropsWithoutRef<'span'>, 'children'> & {
  sobre?: Fondo | undefined;
  basePath?: string | undefined;
  /** Oculta el wordmark y deja solo la aleta, para barras muy estrechas. */
  soloIsotipo?: boolean | undefined;
};

/**
 * El wordmark sale de `naming.wordmark`, no de una cadena escrita a mano, y
 * siempre dice «Eduardo Álvarez». La mascota se llama Tiburoncín y no aparece
 * escrita dentro del logo: no hay ninguna prop que permita cambiar el texto.
 *
 * Cuando se oculta el wordmark, el nombre sigue llegando al lector de pantalla
 * por el `alt` del isotipo. Un logo sin nombre accesible es un logo invisible.
 */
export function Logo({
  sobre = 'oscuro',
  basePath = RUTA_ASSETS,
  soloIsotipo = false,
  className,
  ...props
}: LogoProps) {
  return (
    <span className={cn('gap-xs inline-flex items-center', className)} {...props}>
      <Isotipo
        sobre={sobre}
        basePath={basePath}
        alt={soloIsotipo ? naming.wordmark : ''}
        className="h-7 w-auto"
      />
      {soloIsotipo ? null : (
        <span className="text-ui font-display text-text-primary font-bold tracking-[-0.02em]">
          {naming.wordmark}
        </span>
      )}
    </span>
  );
}
