import { defineConfig } from 'tsup';

/**
 * `dist/tokens/theme.css` NO se produce aquí: lo genera
 * `scripts/build-tokens.mjs` después de tsup, porque `clean` borra `dist/`.
 */
export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'tokens/index': 'src/tokens/index.ts',
    'brand/index': 'src/brand/index.ts',
    'og/index': 'src/og/index.ts',
    'shiki/index': 'src/shiki/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  treeshake: true,
  // Sin sourcemaps. Eran 688 KB de un tarball de 1.1 MB — `index.cjs.map` solo
  // pesaba más que cualquier PNG de la marca, que es el producto. Quien necesite
  // depurar la librería la tiene entera en el repo, con su historia.
  sourcemap: false,
  target: 'es2022',
  external: ['react', 'react-dom'],
});
