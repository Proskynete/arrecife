import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * tailwind-merge no conoce la escala de Arrecife: sin esto, `cn('text-ui',
 * 'text-h2')` deja las dos clases puestas y gana la que el CSS ordene, no la
 * que el consumidor pidió. Cada grupo de aquí es una escala declarada en
 * `tokens.ts`, así que se mantienen sincronizados a mano y a propósito.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['display', 'h1', 'h2', 'h3', 'body', 'ui', 'label', 'eyebrow'] }],
      rounded: [{ rounded: ['chip', 'control', 'card', 'panel', 'pill'] }],
      p: [{ p: ['xs', 'sm', 'md', 'lg', 'xl', 'section'] }],
      px: [{ px: ['xs', 'sm', 'md', 'lg', 'xl', 'section'] }],
      py: [{ py: ['xs', 'sm', 'md', 'lg', 'xl', 'section'] }],
      gap: [{ gap: ['xs', 'sm', 'md', 'lg', 'xl', 'section'] }],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
