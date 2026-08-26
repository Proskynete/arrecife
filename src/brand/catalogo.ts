/**
 * El catálogo de la marca: qué piezas de Tiburoncín existen y cómo se llama su
 * archivo. Datos puros, sin React, para que también lo puedan leer las
 * plantillas de OG y cualquier script.
 *
 * Añadir una pieza nueva es soltar el PNG en `assets/brand/` y añadir una línea
 * aquí. El tipo se actualiza solo y el autocompletado la ofrece de inmediato.
 */

/**
 * Las caras. Solo se usan en estados vacíos, confirmaciones, errores, progreso
 * de curso y celebración — nunca en hero, precios, servicios, contacto ni CV.
 * Por eso `EmptyState` recibe una cara y `PageHeader` no.
 */
export const caras = {
  annoyed: 'face-annoyed.png',
  confused: 'face-confused.png',
  hearts: 'face-hearts.png',
  laughing: 'face-laughing.png',
  shades: 'face-shades.png',
  waiting: 'face-waiting.png',
  wink: 'face-wink.png',
} as const;

/** Poses de cuerpo entero. */
export const poses = {
  desk: 'pose-desk.png',
  'laptop-coffee': 'pose-laptop-coffee.png',
  peek: 'pose-peek.png',
  surf: 'pose-surf.png',
} as const;

/**
 * La aleta, en sus dos variantes.
 *
 * El cuerpo de la aleta es casi negro, así que sobre fondo oscuro la variante de
 * dos azules desaparece. `espuma` es la silueta a una tinta —el 94 % de sus
 * píxeles son `#EDF4F3`, o sea el token espuma— y es la que se ve sobre abismo.
 */
export const aletas = {
  /** Dos azules. Para fondos claros. */
  color: 'fin.png',
  /** Silueta a una tinta. Para fondos oscuros. */
  espuma: 'fin-foam.png',
} as const;

export type Cara = keyof typeof caras;
export type Pose = keyof typeof poses;
export type Aleta = keyof typeof aletas;

/** Sobre qué fondo se va a montar la pieza. Decide qué aleta se usa. */
export type Fondo = 'oscuro' | 'claro';

/**
 * Dónde se sirven los PNG. Por defecto `/brand`, que es donde ya viven en los
 * cinco proyectos (`public/brand/`), así que no hay nada que configurar.
 */
export const RUTA_ASSETS = '/brand';

export const listaCaras = Object.keys(caras) as readonly Cara[];
export const listaPoses = Object.keys(poses) as readonly Pose[];
