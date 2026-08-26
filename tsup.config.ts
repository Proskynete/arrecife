import { defineConfig } from 'tsup';

/**
 * `dist/tokens/theme.css` NO se produce aquí: lo genera
 * `scripts/build-tokens.mjs` después de tsup, porque `clean` borra `dist/`.
 */
export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'tokens/index': 'src/tokens/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  treeshake: true,
  sourcemap: true,
  target: 'es2022',
  external: ['react', 'react-dom'],
});
