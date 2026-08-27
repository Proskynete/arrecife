/**
 * Lo que se publica es `dist/`, no `src/`.
 *
 * Una subruta mal declarada en `exports` compila igual y no falla hasta que
 * alguien la importa desde otro proyecto — que es el peor momento para
 * enterarse. Este check corre después de `build` y verifica tres cosas:
 *
 *   1. Cada archivo que `exports` promete existe de verdad en `dist/`.
 *   2. Cada entrada de `files` existe.
 *   3. Las subrutas portables —`./tokens`, `./og`, `./shiki`— no arrastran
 *      React. Es LA restricción de la librería: las consumen un generador de
 *      OG con Satori, un `astro.config.mjs` y un sitio que no monta React. Si
 *      un token termina dependiendo de un componente, dejan de ser portables.
 */
import { access, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));

/** Las que no pueden depender de React, con el motivo escrito al lado. */
const PORTABLES = {
  './tokens': 'la consumen los cinco proyectos, Satori y un Astro sin React',
  './og': 'corre en un worker o en un script de build',
  './shiki': 'se consume desde astro.config.mjs',
};

const fallos = [];

/** Recorre el objeto de `exports` y devuelve todas las rutas de archivo. */
function rutas(valor, subruta, salida = []) {
  if (typeof valor === 'string') {
    if (valor.startsWith('./')) salida.push({ subruta, archivo: valor });
    return salida;
  }
  if (valor && typeof valor === 'object') {
    for (const anidado of Object.values(valor)) rutas(anidado, subruta, salida);
  }
  return salida;
}

const existe = async (p) => access(resolve(root, p)).then(() => true, () => false);

for (const [subruta, valor] of Object.entries(pkg.exports ?? {})) {
  // Los comodines (`./assets/*`) no se pueden resolver de a uno.
  if (subruta.includes('*')) continue;

  for (const { archivo } of rutas(valor, subruta)) {
    if (!(await existe(archivo))) {
      fallos.push(`exports["${subruta}"] promete ${archivo} y no existe`);
    }
  }
}

for (const entrada of pkg.files ?? []) {
  if (!(await existe(entrada))) {
    fallos.push(`files incluye "${entrada}" y no existe`);
  }
}

for (const [subruta, motivo] of Object.entries(PORTABLES)) {
  const declarado = pkg.exports?.[subruta];
  if (!declarado) {
    fallos.push(`falta la subruta ${subruta} en exports`);
    continue;
  }

  for (const { archivo } of rutas(declarado, subruta)) {
    if (!archivo.endsWith('.js') && !archivo.endsWith('.cjs')) continue;
    if (!(await existe(archivo))) continue;

    const fuente = await readFile(resolve(root, archivo), 'utf8');
    if (/\b(from\s+['"]react|require\(['"]react)/.test(fuente)) {
      fallos.push(`${subruta} importa React en ${archivo} — ${motivo}`);
    }
  }
}

if (fallos.length > 0) {
  console.error('La superficie publicada no cuadra:\n');
  for (const fallo of fallos) console.error(`  ${fallo}`);
  console.error('\nCorre `pnpm build` antes, y revisa `exports` en package.json.');
  process.exit(1);
}

const subrutas = Object.keys(pkg.exports ?? {}).length;
console.log(`arrecife · ${subrutas} subrutas verificadas · las portables no traen React`);
