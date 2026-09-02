/**
 * The entry point of `@eduardoalvarez/arrecife`.
 *
 * It re-exports the tokens for convenience. The direction of the dependencies is
 * always the same: the root may import tokens, tokens never import anything from
 * the root.
 */
export * from './tokens/index.ts';
export * from './theme/index.ts';
export * from './variants/index.ts';
export * from './primitives/index.ts';
export * from './components/index.ts';
export * from './brand/index.ts';
export { cn } from './lib/cn.ts';
/**
 * The social icons are exported HERE as a group and NOT loose, and there is a
 * concrete reason: one of them is called `X`. An `export const X` at the root of
 * a component library is a collision waiting to happen — with a generic's type
 * variable, with an `import { X }` of anything else, with JSX itself.
 *
 *   import { social } from '@eduardoalvarez/arrecife';
 *   <social.GitHub />
 *
 * Loose, they live in `./social`, and that subpath is not a second way of
 * writing the same import: this root carries `"use client"`, and a namespace
 * object cannot cross the RSC boundary — the client reference is per EXPORT, and
 * the properties of a plain object are not exports. From a Next Server Component
 * `social.LinkedIn` resolves to `undefined`, which is a build that dies at
 * prerender. `./social` carries no directive, so the icon renders on the server
 * and costs no client JS.
 *
 *   import { LinkedIn } from '@eduardoalvarez/arrecife/social';
 *
 * See `docs/decisions.md` § 26 for which of the two to reach for.
 *
 * What is NOT exported from `lib/` are the glyphs: `Close`, `ChevronDown`, `Sun`
 * and company are the minimum set the primitives need and they stay inside.
 * Publishing them would turn `glyphs.tsx` into the icon library the system
 * decided not to have, and from there it grows on its own.
 */
export * as social from './social/index.tsx';
