/**
 * El check que faltaba: ningún token de Arrecife pisa un nombre de Tailwind.
 *
 * En Tailwind v4 el nombre de la custom property ES la API. `--spacing-*` no
 * alimenta solo `p-*`, `m-*` y `gap-*`: también resuelve `w-*`, `h-*`,
 * `max-w-*`, `min-w-*`, `max-h-*`, `min-h-*`, `basis-*` y `size-*`, y ahí GANA a
 * la escala `--container-*`. Los escalones de `spacing` se llamaban `xs, sm, md,
 * lg, xl` —los mismos nombres que `--container-*`— así que todo proyecto que
 * importara `theme.css` se quedaba con `max-w-sm` en 12px en vez de en 384px.
 *
 * Nada lo detectó: ni el build, ni los tipos, ni Storybook, ni la suite de axe.
 * La librería no usa `max-w-sm` por dentro, así que el fallo solo existía en los
 * proyectos que la consumen y no dejaba ni un error en consola. Se descubrió en
 * producción, con el párrafo de un hero a una palabra por línea.
 *
 * Este script lo convierte en un fallo de build. Los nombres reservados NO están
 * escritos aquí a mano: se leen del `theme.css` de la versión de Tailwind que
 * hay instalada, así que si Tailwind estrena un escalón, el check se entera al
 * actualizar la dependencia y no seis meses después.
 */
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { themeCss } from './build-tokens.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);

/* ------------------------------------------- los nombres que reserva Tailwind */

const temaTailwind = await readFile(require.resolve('tailwindcss/theme.css'), 'utf8');

/** `--spacing-step-md: 16px` → `['spacing', 'step-md']`. Ignora `--text-h1--line-height`. */
const DECLARACION = /^\s*--([a-z]+)-([a-z0-9][a-z0-9-]*?):/gim;

/** Los nombres que Tailwind ya define en cada espacio, leídos de su theme.css. */
function nombresPorEspacio(css) {
  const mapa = new Map();
  for (const [, espacio, nombre] of css.matchAll(DECLARACION)) {
    if (nombre.includes('--')) continue; // modificadores: --text-h1--line-height
    if (!mapa.has(espacio)) mapa.set(espacio, new Set());
    mapa.get(espacio).add(nombre);
  }
  return mapa;
}

const deTailwind = nombresPorEspacio(temaTailwind);
const nombresDe = (espacio) => deTailwind.get(espacio) ?? new Set();

/**
 * Qué nombres no puede usar cada espacio nuestro, y por qué.
 *
 * `spacing` es el caso raro y es EL caso: además de su propio espacio, se come
 * la escala `--container-*` en todas las utilidades de ancho y alto. Por eso
 * mira las dos listas.
 */
const RESERVADOS = [
  {
    espacio: 'spacing',
    prohibidos: () => new Set([...nombresDe('spacing'), ...nombresDe('container')]),
    porque:
      'las utilidades de ancho y alto (max-w-*, w-*, h-*, basis-*, size-*) resuelven ' +
      '--spacing-* ANTES que --container-*, así que este nombre se come el escalón de Tailwind',
  },
  {
    espacio: 'text',
    prohibidos: () => nombresDe('text'),
    porque: 'text-* dejaría de dar el tamaño de Tailwind',
  },
  {
    espacio: 'radius',
    prohibidos: () => nombresDe('radius'),
    porque: 'rounded-* dejaría de dar el radio de Tailwind',
  },
  {
    espacio: 'container',
    prohibidos: () => nombresDe('container'),
    porque: 'max-w-* dejaría de dar el ancho de Tailwind',
  },
  {
    espacio: 'font',
    prohibidos: () => nombresDe('font'),
    porque: 'font-* dejaría de dar la familia de Tailwind',
  },
  {
    espacio: 'shadow',
    prohibidos: () => nombresDe('shadow'),
    porque: 'shadow-* dejaría de dar la sombra de Tailwind',
  },
  {
    espacio: 'ease',
    prohibidos: () => nombresDe('ease'),
    porque: 'ease-* dejaría de dar la curva de Tailwind',
  },
  {
    espacio: 'color',
    prohibidos: () => nombresDe('color'),
    porque: 'bg-*, text-* y border-* dejarían de dar el color de Tailwind',
  },
];

/**
 * Un escalón numérico en `--spacing-*` es igual de venenoso y no sale del
 * theme.css de Tailwind: `--spacing: 0.25rem` genera `p-1`…`p-96` por cálculo,
 * así que un `--spacing-4` nuestro pisaría `p-4` sin aparecer en ninguna lista.
 */
const NUMERICO = /^\d+(\.\d+)?$/;

/**
 * Los pisotones DELIBERADOS. Van aquí con su motivo, y aquí se discuten.
 *
 * `font-sans` y `font-mono` se pisan a propósito: el sistema tiene sus familias
 * y `font-sans` tiene que dar Geist, no la pila del sistema. Es el sentido de
 * importar los tokens.
 */
const DELIBERADOS = new Map([
  ['--font-sans', 'la familia del sistema es Geist, no la pila por defecto'],
  ['--font-mono', 'la familia mono del sistema es JetBrains Mono'],
]);

/* ------------------------------------------------- lo que emitimos nosotros */

const fallos = [];

for (const [, espacio, nombre] of themeCss.matchAll(DECLARACION)) {
  if (nombre.includes('--')) continue;
  const propiedad = `--${espacio}-${nombre}`;
  if (DELIBERADOS.has(propiedad)) continue;

  const regla = RESERVADOS.find((r) => r.espacio === espacio);
  if (regla && regla.prohibidos().has(nombre)) {
    fallos.push({ propiedad, porque: regla.porque });
    continue;
  }

  if (espacio === 'spacing' && NUMERICO.test(nombre)) {
    fallos.push({
      propiedad,
      porque: 'un nombre numérico en --spacing-* pisa la escala p-1…p-96 de Tailwind',
    });
  }
}

if (fallos.length > 0) {
  console.error(
    'Un token de Arrecife pisa un nombre de Tailwind. Un proyecto que importe\n' +
      'theme.css perderá esa utilidad sin recibir ningún aviso:\n',
  );
  for (const { propiedad, porque } of fallos) {
    console.error(`  ${propiedad}`);
    console.error(`    ${porque}\n`);
  }
  console.error(
    'Se arregla renombrando el token en src/tokens/tokens.ts con un grupo propio\n' +
      '(`stepMd` → --spacing-step-md), como ya hacen `spacing.step*` y `control`.\n' +
      'Redeclarar el token de Tailwind NO funciona: el nuestro gana la resolución.',
  );
  process.exit(1);
}

const emitidos = [...themeCss.matchAll(DECLARACION)].filter(([, , n]) => !n.includes('--'));
console.log(
  `arrecife · ${emitidos.length} tokens, ninguno pisa un nombre de Tailwind ` +
    `(${relative(root, require.resolve('tailwindcss/theme.css')).replace(/^.*node_modules\//, '')})`,
);
