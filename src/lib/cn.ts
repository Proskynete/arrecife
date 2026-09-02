import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

import { control, radius, spacing, typeScale } from '../tokens/tokens.ts';

/**
 * tailwind-merge does not know the Arrecife scale, and that is not cosmetic:
 * undeclared, `text-tag` does not look like a size but like a COLOR — `text-` is
 * ambiguous — so in `cn('text-tag', 'text-text-primary')` the last one wins and
 * the size disappears. The class stays written in the component and never
 * reaches the DOM.
 *
 * This list used to be maintained by hand «on purpose». It drifted: `stat`,
 * `meta`, `tag`, `chip` and `lead` went into `typeScale` and not in here, and
 * all five were being dropped by any piece that also asked for a tone — which
 * is nearly all of them. Badges rendered at an inherited 16px instead of 12.5.
 *
 * It is DERIVED from `tokens.ts` now. Adding a step can no longer be forgotten
 * here, because there is nothing to add here. The dependency direction is the
 * usual one: `lib/` may import tokens, tokens import nothing.
 */

/** camelCase → kebab-case, same as in `scripts/build-tokens.mjs`. */
const kebab = (name: string) => name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

const scales = Object.keys(typeScale);
const radii = Object.keys(radius);
/** `spacing.stepMd` is emitted as `--spacing-step-md` → `p-step-md`. */
const namespaces = Object.keys(spacing).map(kebab);
/** `control.md` is emitted as `--spacing-control-md` → `px-control-md`. */
const controls = Object.keys(control).map((name) => `control-${kebab(name)}`);

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: scales }],
      rounded: [{ rounded: radii }],
      p: [{ p: namespaces }],
      px: [{ px: [...namespaces, ...controls] }],
      py: [{ py: namespaces }],
      gap: [{ gap: namespaces }],
      size: [{ size: controls }],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
