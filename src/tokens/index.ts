/**
 * The entry point of `@eduardoalvarez/arrecife/tokens`.
 *
 * Same as `tokens.ts`: it imports nothing from outside this directory. It is the
 * only subpackage the five projects, Satori and React-less Astro can all
 * consume.
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
  syntax,
  size,
  spacing,
  tagline,
  typeScale,
} from './tokens.ts';

/** Every token in a single object, for Satori templates and generators. */
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
  syntax,
  series,
  shadow,
  motion,
  tagline,
  naming,
} as const;

export type Tokens = typeof tokens;
