/**
 * Punto de entrada de `@eduardoalvarez/arrecife/shiki`.
 *
 * Igual que `./og`: se publica aparte porque un tema de resaltado se consume
 * desde `astro.config.mjs` o desde un script de build, y no debe arrastrar React
 * ni un solo componente.
 */
export * from './tema.ts';
