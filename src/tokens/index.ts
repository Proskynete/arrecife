/**
 * Punto de entrada de `@eduardoalvarez/arrecife/tokens`.
 *
 * Igual que `tokens.ts`: no importa nada fuera de este directorio. Es el único
 * subpaquete que pueden consumir los cinco proyectos, Satori y Astro sin React.
 */
export * from './tokens.ts';

import {
  brand,
  colors,
  control,
  fonts,
  gradient,
  limits,
  motion,
  naming,
  radius,
  series,
  shadow,
  sintaxis,
  size,
  spacing,
  tagline,
  typeScale,
} from './tokens.ts';

/** Todos los tokens en un solo objeto, para plantillas Satori y generadores. */
export const tokens = {
  colors,
  brand,
  fonts,
  typeScale,
  limits,
  radius,
  control,
  spacing,
  size,
  gradient,
  sintaxis,
  series,
  shadow,
  motion,
  tagline,
  naming,
} as const;

export type Tokens = typeof tokens;
