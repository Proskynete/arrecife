/**
 * Valida `release-please-config.json` contra el esquema OFICIAL.
 *
 * Existe por una razón concreta y cara: release-please **ignora en silencio**
 * las claves que no conoce. Un `"component": ""` o un `"package-name"` mal
 * puestos no dan error, no salen en el log y no hacen nada — así que la
 * configuración parece correcta mientras el release no se corta, y el diagnóstico
 * se va a adivinar en vez de a leer.
 *
 * Esta comprobación convierte ese silencio en un fallo de build, igual que
 * `check-tokens-purity.mjs` hace con la pureza de los tokens.
 *
 * Lo que NO valida: los valores. Solo que cada clave exista en el esquema, que
 * es donde estuvieron los tres errores reales.
 *
 * Sin red, avisa y sale con 0: no puede ser el check que rompe un build por
 * estar el CDN de GitHub caído.
 */
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const config = JSON.parse(await readFile(resolve(root, 'release-please-config.json'), 'utf8'));

const url = config.$schema;
if (!url) {
  console.error('release-please-config.json no declara $schema. Añádelo.');
  process.exit(1);
}

let esquema;
try {
  const respuesta = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
  esquema = await respuesta.json();
} catch (error) {
  console.warn(`arrecife · no se pudo leer el esquema (${error.message}). Se omite.`);
  process.exit(0);
}

const clavesRaiz = Object.keys(esquema.properties ?? {});
const clavesPaquete = Object.keys(esquema.definitions?.ReleaserConfigOptions?.properties ?? {});

if (clavesRaiz.length === 0 || clavesPaquete.length === 0) {
  console.warn('arrecife · el esquema cambió de forma y no se pudo leer. Se omite.');
  process.exit(0);
}

const fallos = [];

for (const clave of Object.keys(config)) {
  if (clave === '$schema') continue;
  if (!clavesRaiz.includes(clave)) fallos.push(`raíz · "${clave}" no existe en el esquema`);
}

for (const [ruta, paquete] of Object.entries(config.packages ?? {})) {
  for (const clave of Object.keys(paquete)) {
    if (!clavesPaquete.includes(clave)) {
      fallos.push(`packages["${ruta}"] · "${clave}" no existe en el esquema`);
    }
  }
}

if (fallos.length > 0) {
  console.error('release-please-config.json tiene claves que release-please ignoraría:\n');
  for (const fallo of fallos) console.error(`  ${fallo}`);
  console.error(`\nEl esquema manda: ${url}`);
  process.exit(1);
}

const total = Object.keys(config.packages ?? {}).length;
console.log(`arrecife · release-please-config.json válido · ${total} paquete(s)`);
