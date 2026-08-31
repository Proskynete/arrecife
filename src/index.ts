/**
 * Punto de entrada de `@eduardoalvarez/arrecife`.
 *
 * Reexporta los tokens por conveniencia. La dirección de las dependencias es
 * siempre la misma: la raíz puede importar tokens, los tokens nunca importan
 * nada de la raíz.
 */
export * from './tokens/index.ts';
export * from './tema/index.ts';
export * from './primitives/index.ts';
export * from './components/index.ts';
export * from './brand/index.ts';
export { cn } from './lib/cn.ts';

/**
 * Los ocho iconos de redes van agrupados, NO sueltos, y hay un motivo concreto:
 * uno de ellos se llama `X`. Un `export const X` en la raíz de una librería de
 * componentes es una colisión esperando a pasar — con una variable de un genérico,
 * con un `import { X }` de cualquier otra cosa, con el propio JSX.
 *
 *   import { social } from '@eduardoalvarez/arrecife';
 *   <social.GitHub />
 *
 * `import { GitHub }` NO existe, y es la primera forma que prueba todo el mundo.
 * Por eso está escrito aquí, en el README y en `llms.txt`.
 *
 * Lo que NO se exporta de `lib/` son los glifos: `Close`, `ChevronDown`, `Sol` y
 * compañía son el juego mínimo que necesitan los primitivos y se quedan dentro.
 * Publicarlos convertiría `glyphs.tsx` en la librería de iconos que el sistema
 * decidió no tener, y a partir de ahí crece sola.
 */
export * as social from './lib/social.tsx';
