import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

import { control, radius, spacing, typeScale } from '../tokens/tokens.ts';

/**
 * tailwind-merge no conoce la escala de Arrecife, y eso no es cosmético: sin
 * declararla, `text-tag` no parece un tamaño sino un COLOR —`text-` es ambiguo—,
 * así que en `cn('text-tag', 'text-text-primary')` gana el último y el tamaño
 * desaparece. La clase queda escrita en el componente y no llega al DOM.
 *
 * Esta lista se mantenía a mano «y a propósito». Se desincronizó: `stat`,
 * `meta`, `tag`, `chip` y `lead` entraron en `typeScale` y no aquí, y las cinco
 * se estaban cayendo en cualquier pieza que además pidiera un tono — que son
 * casi todas. Los badges renderizaban a 16px heredados en vez de a 12.5.
 *
 * Ahora se DERIVA de `tokens.ts`. Añadir un escalón ya no puede olvidarse aquí,
 * porque aquí no hay nada que añadir. La dirección de la dependencia es la de
 * siempre: `lib/` puede importar tokens, los tokens no importan nada.
 */

/** camelCase → kebab-case, igual que en `scripts/build-tokens.mjs`. */
const kebab = (nombre: string) => nombre.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

const escalas = Object.keys(typeScale);
const radios = Object.keys(radius);
/** `spacing.stepMd` se emite como `--spacing-step-md` → `p-step-md`. */
const espacios = Object.keys(spacing).map(kebab);
/** `control.md` se emite como `--spacing-control-md` → `px-control-md`. */
const controles = Object.keys(control).map((nombre) => `control-${kebab(nombre)}`);

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: escalas }],
      rounded: [{ rounded: radios }],
      p: [{ p: espacios }],
      px: [{ px: [...espacios, ...controles] }],
      py: [{ py: espacios }],
      gap: [{ gap: espacios }],
      size: [{ size: controles }],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
