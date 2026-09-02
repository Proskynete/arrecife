/**
 * The entry point of `@eduardoalvarez/arrecife`.
 *
 * It re-exports the tokens for convenience. The direction of the dependencies is
 * always the same: the root may import tokens, tokens never import anything from
 * the root.
 */
export * from './tokens/index.ts';
export * from './theme/index.ts';
export * from './primitives/index.ts';
export * from './components/index.ts';
export * from './brand/index.ts';
export { cn } from './lib/cn.ts';
/**
 * The eight social icons are exported as a group, NOT loose, and there is a
 * concrete reason: one of them is called `X`. An `export const X` at the root of
 * a component library is a collision waiting to happen — with a generic's type
 * variable, with an `import { X }` of anything else, with JSX itself.
 *
 *   import { social } from '@eduardoalvarez/arrecife';
 *   <social.GitHub />
 *
 * `import { GitHub }` does NOT exist, and it is the first thing everyone tries.
 * Which is why it is written here, in the README and in `llms.txt`.
 *
 * What is NOT exported from `lib/` are the glyphs: `Close`, `ChevronDown`, `Sun`
 * and company are the minimum set the primitives need and they stay inside.
 * Publishing them would turn `glyphs.tsx` into the icon library the system
 * decided not to have, and from there it grows on its own.
 */
export * as social from './lib/social.tsx';
