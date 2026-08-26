/**
 * La restricción que manda sobre todo lo demás, como check y no como comentario:
 * `src/tokens/` no importa nada fuera de `src/tokens/`.
 *
 * Es el único subpaquete que consumen los cinco proyectos, el generador de OG
 * con Satori y un sitio Astro que no monta React. Si un token termina
 * dependiendo de un componente, la librería dejó de ser portable.
 */
import { readdir, readFile } from 'node:fs/promises';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dir = resolve(root, 'src/tokens');

const ESPECIFICADOR = /(?:^|\n)\s*(?:import|export)\b[^\n;]*?\bfrom\s*['"]([^'"]+)['"]/g;
const IMPORT_DINAMICO = /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
const REQUIRE = /\brequire\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

const fallos = [];

for (const archivo of await readdir(dir, { recursive: true })) {
  if (!/\.(ts|tsx|mts|cts|js|mjs)$/.test(archivo)) continue;
  const ruta = resolve(dir, archivo);
  const fuente = await readFile(ruta, 'utf8');

  for (const patron of [ESPECIFICADOR, IMPORT_DINAMICO, REQUIRE]) {
    patron.lastIndex = 0;
    let m;
    while ((m = patron.exec(fuente)) !== null) {
      const especificador = m[1];
      if (especificador.startsWith('.')) {
        // Relativo: solo vale si no se sale de src/tokens/.
        const destino = resolve(dirname(ruta), especificador);
        if (!relative(dir, destino).startsWith('..')) continue;
      }
      fallos.push(`${relative(root, ruta)} → ${especificador}`);
    }
  }
}

if (fallos.length > 0) {
  console.error('src/tokens/ importó algo de fuera. La librería dejó de ser portable:\n');
  for (const fallo of fallos) console.error(`  ${fallo}`);
  console.error('\nLos tokens no dependen de React, de componentes ni de CSS de terceros.');
  process.exit(1);
}

console.log('arrecife · src/tokens/ limpio: cero dependencias externas');
