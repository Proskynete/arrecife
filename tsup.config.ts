import { defineConfig } from 'tsup';

/**
 * `dist/tokens/theme.css` NO se produce aquí: lo genera
 * `scripts/build-tokens.mjs` después de tsup, porque `clean` borra `dist/`.
 */
export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'tokens/index': 'src/tokens/index.ts',
    'tema/index': 'src/tema/index.ts',
    'brand/index': 'src/brand/index.ts',
    'og/index': 'src/og/index.ts',
    'shiki/index': 'src/shiki/index.ts',
    'form/index': 'src/form/index.tsx',
    'chart/index': 'src/chart/index.tsx',
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
  // Las dos últimas son dependencias de pares OPCIONALES: solo las instala el
  // proyecto que importa `./form` o `./chart`. Van aquí porque en este repo son
  // devDependencies —hacen falta para compilar y para las stories— y sin esta
  // línea tsup las metería dentro del bundle publicado.
  external: ['react', 'react-dom', 'react-hook-form', 'recharts'],
});
