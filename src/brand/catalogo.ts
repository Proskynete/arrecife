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

/**
 * El uso asignado de cada cara, del inventario del manual.
 *
 * No es documentación suelta: es la parte del contrato de humor que se puede
 * escribir como dato. El manual asigna una situación a cada cara, y sin esto la
 * elección se hacía a ojo en cada sitio de uso — que es como `annoyed` termina
 * en una confirmación y `hearts` en un error.
 *
 * Falta una: el manual lista ocho caras y `head-5` (sorpresa · confirmación
 * destructiva) no tiene PNG en `assets/brand/`. Cuando llegue, entra aquí y en
 * `caras` a la vez.
 */
export const usoDeCara = {
  wink: 'Formularios, nota al pie amable',
  waiting: 'Sin resultados, estado de espera',
  laughing: 'Éxito, suscripción confirmada',
  shades: 'Módulo o curso completado',
  hearts: 'Agradecimiento, OG de artículo',
  confused: '404, página no encontrada',
  annoyed: 'Error del servidor, fallo de build',
} as const satisfies Record<keyof typeof caras, string>;

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
