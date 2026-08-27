/**
 * Punto de entrada de `@eduardoalvarez/arrecife/og`.
 *
 * Se publica aparte a propósito: un generador de OG corre en un worker o en un
 * script de build, y no debe arrastrar React ni un solo componente. Es
 * exactamente el caso que justifica la pureza de `src/tokens/`.
 */
export * from './plantillas.ts';
