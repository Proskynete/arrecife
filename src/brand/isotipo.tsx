import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';
import { aletas, RUTA_ASSETS, type Fondo } from './catalogo.ts';

export type IsotipoProps = Omit<ComponentPropsWithoutRef<'img'>, 'src' | 'alt'> & {
  /**
   * Sobre qué fondo se monta. Es obligatorio decidirlo, aunque tenga default:
   * el cuerpo de la aleta es casi negro, así que la variante de dos azules
   * desaparece sobre abismo. Al ser una prop, la regla deja de ser algo que
   * recordar.
   */
  sobre?: Fondo | undefined;
  basePath?: string | undefined;
  /** Texto alternativo. Vacío cuando el isotipo acompaña a un texto que ya lo nombra. */
  alt?: string | undefined;
};

export function Isotipo({
  sobre = 'oscuro',
  basePath = RUTA_ASSETS,
  alt = '',
  className,
  ...props
}: IsotipoProps) {
  const archivo = sobre === 'oscuro' ? aletas.espuma : aletas.color;

  return (
    <img
      src={`${basePath}/${archivo}`}
      alt={alt}
      width={147}
      height={111}
      className={cn('h-8 w-auto select-none', className)}
      {...props}
    />
  );
}
