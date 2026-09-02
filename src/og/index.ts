/**
 * The entry point of `@eduardoalvarez/arrecife/og`.
 *
 * It is published separately on purpose: an OG generator runs in a worker or in
 * a build script, and must not drag in React or a single component. It is
 * exactly the case that justifies the purity of `src/tokens/`.
 */
export * from './templates.ts';
