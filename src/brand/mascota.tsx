import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';
import { caras, poses, RUTA_ASSETS, type Cara, type Pose } from './catalogo.ts';

type Base = Omit<ComponentPropsWithoutRef<'img'>, 'src' | 'alt'> & {
  basePath?: string | undefined;
  /**
   * Texto alternativo. Vacío por defecto: la mascota es ilustración y el texto
   * que la acompaña ya dice lo que hay que saber. Se rellena solo cuando la
   * imagen aporta información que no está escrita al lado.
   */
  alt?: string | undefined;
};

export type MascotaProps = Base & { pose: Pose };

/** Tiburoncín de cuerpo entero. */
export function Mascota({
  pose,
  basePath = RUTA_ASSETS,
  alt = '',
  className,
  ...props
}: MascotaProps) {
  return (
    <img
      src={`${basePath}/${poses[pose]}`}
      alt={alt}
      className={cn('h-auto w-full max-w-64 select-none', className)}
      {...props}
    />
  );
}

export type CaraDeMascotaProps = Base & { expresion: Cara };

/**
 * La cabeza de Tiburoncín, con expresión.
 *
 * Las caras van SOLO en estados vacíos, confirmaciones, errores, progreso de
 * curso y celebración. Nunca en hero, precios, servicios, contacto ni CV. Por
 * eso `EmptyState` recibe una cara y `PageHeader` no: la regla no está escrita
 * en una guía que haya que recordar, está en qué componentes la aceptan.
 */
export function CaraDeMascota({
  expresion,
  basePath = RUTA_ASSETS,
  alt = '',
  className,
  ...props
}: CaraDeMascotaProps) {
  return (
    <img
      src={`${basePath}/${caras[expresion]}`}
      alt={alt}
      className={cn('h-auto w-full max-w-24 select-none', className)}
      {...props}
    />
  );
}
