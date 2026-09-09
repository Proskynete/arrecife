/**
 * The entry point of `@eduardoalvarez/arrecife`.
 *
 * It re-exports the tokens for convenience. The direction of the dependencies is
 * always the same: the root may import tokens, tokens never import anything from
 * the root.
 *
 * WHAT IS NO LONGER HERE, and it is the whole shape of 0.10.0: `social`. The ten
 * hand-drawn brand marks were the library's own icon inventory, and the library
 * stopped having one — every glyph it draws now comes from Phosphor through
 * `Icon`. The migration is one import per call site and it is in
 * `docs/runbooks/migration-0.10.md`; the argument is in `docs/decisions/0.10.md`
 * § 51.
 *
 * `Icon` itself is NOT re-exported from here, and that has not changed: it lives
 * at `@eduardoalvarez/arrecife/icons` and carries no `"use client"`, so a Next
 * Server Component draws an icon without opening a client boundary. Pulling it
 * through this root — which IS a client entry — would take that away from every
 * consumer at once.
 */
export * from './tokens/index.ts';
export * from './theme/index.ts';
export * from './variants/index.ts';
export * from './primitives/index.ts';
export * from './components/index.ts';
export * from './brand/index.ts';
export { cn } from './lib/cn.ts';
