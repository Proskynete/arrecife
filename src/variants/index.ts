/**
 * The entry point of `@eduardoalvarez/arrecife/variants`.
 *
 * The class vocabulary of the system, with **no React**. Every `cva()` here is a
 * function that returns a string of classes: it touches neither React nor the
 * DOM, and it can be imported from an Astro that mounts no framework, from a
 * server component or from the frontmatter of a `.astro`.
 *
 * It exists because these functions used to live in the components, so importing
 * one dragged the whole library along. That had a cost measured in two of the
 * five projects:
 *
 * - In `cursos`, a Next project, it forced a `"use client"` on an adapter whose
 *   entire content was one call to CVA — and 272 KB of client chunk with it.
 * - In `links`, which depends on no React at all, it was not even an option: the
 *   project copied the class vocabulary by hand into `LinkRow.astro` and
 *   `Footer.astro`. That copy had already drifted once, and nobody saw it
 *   because nothing compared the two.
 *
 * The rule for deciding what belongs here: if it returns classes, it goes here;
 * if it returns markup, it stays in the component. `Button` renders a
 * `<button>`, so it stays at the root; `buttonVariants` returns a string, so it
 * is here.
 *
 * `check-package-exports.mjs` verifies that this subpath brings no React into
 * the published `dist/`, the same way it does for `./tokens`, `./theme`, `./og`
 * and `./shiki`.
 *
 * The root re-exports all of this for convenience, so a project already
 * importing `buttonVariants` from `@eduardoalvarez/arrecife` keeps working. What
 * this subpath buys is not the name, it is not paying for React to get it.
 */
export { buttonVariants } from './button.ts';
export { badgeVariants, categoryBadgeVariants, metricBadgeVariants } from './badge.ts';
export { textVariants } from './typography.ts';
export { alertVariants } from './alert.ts';
export { avatarVariants } from './avatar.ts';
export { CARD, CARD_SURFACE, CARD_HOVER } from './card.ts';
