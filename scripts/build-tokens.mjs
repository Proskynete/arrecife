/**
 * Genera la salida de Tailwind a partir de `src/tokens/tokens.ts`.
 *
 * Una sola fuente, salidas generadas: `dist/tokens/theme.css` (`@theme`, para
 * los proyectos en Tailwind v4). Nada de esto se edita a mano y se regenera en
 * cada build. Cambia un hex en `tokens.ts` y la salida cambia.
 *
 * Si algún día hay que volver a publicar el preset de v3 (portfolio sin migrar),
 * es añadir un emisor más abajo que lea el mismo `tokens`: la fuente no cambia.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { tokens } = await import(resolve(root, 'src/tokens/index.ts'));

const AVISO = [
  '/*',
  ' * GENERADO por scripts/build-tokens.mjs desde src/tokens/tokens.ts.',
  ' * No lo edites a mano: se regenera en cada build.',
  ' *',
  ' * Uso en un proyecto Tailwind v4:',
  ' *   @import "tailwindcss";',
  ' *   @import "@eduardoalvarez/arrecife/tokens/theme.css";',
  ' *',
  ' * El modo oscuro es el primario y es el default. Un proyecto en modo claro',
  ' * declara data-theme="light" en <html>.',
  ' *',
  ' * Las familias tipográficas se declaran por nombre: el proyecto carga',
  ' * Bricolage Grotesque, Geist y JetBrains Mono como prefiera.',
  ' */',
].join('\n');

/** camelCase → kebab-case, para el nombre de la custom property. */
const kebab = (s) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

const px = (n) => `${n}px`;

function bloqueColores(paleta, indent = '  ') {
  return Object.entries(paleta)
    .map(([nombre, hex]) => `${indent}--color-${kebab(nombre)}: ${hex};`)
    .join('\n');
}

function bloqueMarca(indent = '  ') {
  return Object.entries(tokens.brand)
    .map(([nombre, hex]) => `${indent}--color-brand-${kebab(nombre)}: ${hex};`)
    .join('\n');
}

function bloqueTipografia() {
  const lineas = [];
  for (const [nombre, familia] of Object.entries(tokens.fonts)) {
    lineas.push(`  --font-${nombre}: ${familia};`);
  }
  lineas.push('');
  for (const [nombre, escala] of Object.entries(tokens.typeScale)) {
    lineas.push(`  --text-${nombre}: ${px(escala.size)};`);
    if ('lineHeight' in escala) {
      lineas.push(`  --text-${nombre}--line-height: ${escala.lineHeight};`);
    }
    if ('weight' in escala) {
      lineas.push(`  --text-${nombre}--font-weight: ${escala.weight};`);
    }
    if ('tracking' in escala) {
      lineas.push(`  --text-${nombre}--letter-spacing: ${escala.tracking};`);
    }
  }
  return lineas.join('\n');
}

function bloqueGradientes(modo, indent = '  ') {
  return Object.entries(tokens.gradient[modo])
    .map(([nombre, valor]) => `${indent}--gradient-${kebab(nombre)}: ${valor};`)
    .join('\n');
}

function bloqueForma() {
  const lineas = [];
  for (const [nombre, valor] of Object.entries(tokens.radius)) {
    lineas.push(`  --radius-${nombre}: ${px(valor)};`);
  }
  lineas.push('');
  for (const [nombre, valor] of Object.entries(tokens.spacing)) {
    lineas.push(`  --spacing-${nombre}: ${px(valor)};`);
  }
  lineas.push('');
  // Los controles entran en la escala de espaciado con prefijo propio: dan
  // px-control-md y size-control-icon, y no se ofrecen como margen suelto.
  for (const [nombre, valor] of Object.entries(tokens.control)) {
    lineas.push(`  --spacing-control-${kebab(nombre)}: ${px(valor)};`);
  }
  lineas.push('');
  // `nav` es una altura (h-nav); `content` y `wide` son anchos (max-w-content).
  lineas.push(`  --spacing-nav: ${px(tokens.size.nav)};`);
  lineas.push(`  --container-content: ${px(tokens.size.content)};`);
  lineas.push(`  --container-wide: ${px(tokens.size.wide)};`);
  lineas.push(`  --container-measure: ${tokens.limits.measure};`);
  lineas.push('');
  lineas.push(`  --shadow-standard: ${tokens.shadow.standard};`);
  lineas.push('');
  lineas.push(`  --duration-standard: ${tokens.motion.duration};`);
  lineas.push(`  --ease-standard: ${tokens.motion.easing};`);
  return lineas.join('\n');
}

const themeCss = `${AVISO}

/* El modo se elige con data-theme. El oscuro es el primario, así que es el
   default: un proyecto claro declara data-theme="light" en <html>. */
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));
@custom-variant light (&:where([data-theme="light"], [data-theme="light"] *));

@theme {
  /* --- color · modo oscuro (default) ------------------------------------ */
${bloqueColores(tokens.colors.dark)}

  /* --- marca · iguales en los dos modos ---------------------------------- */
${bloqueMarca()}

  /* --- tipografía --------------------------------------------------------- */
${bloqueTipografia()}

  /* --- forma y ritmo ------------------------------------------------------ */
${bloqueForma()}

  /* --- degradados · modo oscuro (default) --------------------------------- */
${bloqueGradientes('dark')}
}

/* --- color por modo, anidable ---------------------------------------------
   Los dos modos se emiten como bloques propios, no solo el claro. Así un
   subárbol puede declarar el modo contrario al de la página y todo lo de dentro
   lo respeta: es lo que necesita un bloque de código, que va sobre casco en los
   dos temas y por tanto siempre lleva tinta clara encima. */
[data-theme='dark'] {
${bloqueColores(tokens.colors.dark)}

${bloqueGradientes('dark')}
}

[data-theme='light'] {
${bloqueColores(tokens.colors.light)}

${bloqueGradientes('light')}
}

/* --- los dos degradados del sistema, como utilidad --------------------------
   Son los dos únicos bloques con degradado: el hero y el panel de sección. Que
   sean utilidades y no clases arbitrarias es lo que impide que cada proyecto
   escriba su propio ángulo. Siguen el modo porque leen la custom property. */
@utility degradado-hero {
  background-image: var(--gradient-hero);
}
@utility degradado-seccion {
  background-image: var(--gradient-seccion);
}

/* --- la tercera excepción de movimiento: el shimmer del skeleton ------------
   El sistema no anima, y esta es la tercera y última salvedad, junto al spinner
   del botón y el panel lateral. Todas son realimentación de PROGRESO, no de
   estado: un bloque quieto y un bloque que nunca va a cargar se ven igual.

   1.4s lineal, del documento. Va detrás de motion-safe en el componente. */
@keyframes arrecife-shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}

@utility shimmer {
  background-image: linear-gradient(
    90deg,
    transparent 0%,
    var(--color-hairline-hover) 50%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: arrecife-shimmer 1.4s linear infinite;
}

/* --- la excepción del panel lateral -----------------------------------------
   Un panel que entra desde un borde se desliza por definición: quieto sería un
   modal descentrado. Es la segunda y última excepción a "nada de
   desplazamiento", y se aprobó a sabiendas.

   Dura lo que dura todo lo demás y usa la misma curva, así que no introduce un
   tiempo nuevo. En el componente va detrás de motion-safe. */
@keyframes arrecife-entra-derecha { from { translate: 100% 0; } }
@keyframes arrecife-sale-derecha { to { translate: 100% 0; } }
@keyframes arrecife-entra-izquierda { from { translate: -100% 0; } }
@keyframes arrecife-sale-izquierda { to { translate: -100% 0; } }
@keyframes arrecife-entra-arriba { from { translate: 0 -100%; } }
@keyframes arrecife-sale-arriba { to { translate: 0 -100%; } }
@keyframes arrecife-entra-abajo { from { translate: 0 100%; } }
@keyframes arrecife-sale-abajo { to { translate: 0 100%; } }

@utility deslizar-entra-derecha {
  animation: arrecife-entra-derecha var(--duration-standard) var(--ease-standard);
}
@utility deslizar-sale-derecha {
  animation: arrecife-sale-derecha var(--duration-standard) var(--ease-standard);
}
@utility deslizar-entra-izquierda {
  animation: arrecife-entra-izquierda var(--duration-standard) var(--ease-standard);
}
@utility deslizar-sale-izquierda {
  animation: arrecife-sale-izquierda var(--duration-standard) var(--ease-standard);
}
@utility deslizar-entra-arriba {
  animation: arrecife-entra-arriba var(--duration-standard) var(--ease-standard);
}
@utility deslizar-sale-arriba {
  animation: arrecife-sale-arriba var(--duration-standard) var(--ease-standard);
}
@utility deslizar-entra-abajo {
  animation: arrecife-entra-abajo var(--duration-standard) var(--ease-standard);
}
@utility deslizar-sale-abajo {
  animation: arrecife-sale-abajo var(--duration-standard) var(--ease-standard);
}

/* La única transición del sistema, como utilidad. Los estados se comunican con
   borde y color, no con movimiento: esta clase no puede animar otra cosa. */
@utility transition-standard {
  transition-property: ${tokens.motion.properties};
  transition-duration: var(--duration-standard);
  transition-timing-function: var(--ease-standard);
}
`;

const destino = resolve(root, 'dist/tokens/theme.css');
await mkdir(dirname(destino), { recursive: true });
await writeFile(destino, themeCss, 'utf8');

console.log(`arrecife · tokens → ${destino.replace(`${root}/`, '')}`);
