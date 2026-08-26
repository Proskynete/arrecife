/**
 * Arrecife — fuente única de la identidad visual.
 *
 * LA RESTRICCIÓN QUE MANDA SOBRE TODO LO DEMÁS: este archivo no importa nada.
 * Ni React, ni componentes, ni CSS de terceros. Lo consumen los cinco proyectos,
 * un generador de OG con Satori y un sitio Astro que no monta React. Si un token
 * termina dependiendo de un componente, la librería dejó de ser portable.
 * `scripts/check-tokens-purity.mjs` lo verifica en cada build.
 *
 * Los contrastes están MEDIDOS, no estimados. No cambies un hex para que
 * «combine mejor»: #0F8F80 (3.57:1) y #B4632A (3.95:1) ya se corrigieron por no
 * pasar AA sobre papel. Si los ves en algún lado, están mal.
 *
 * Segunda corrección, por la misma razón. El documento medía todo contra
 * `background`, pero `surfaceRaised` es el peor caso en los DOS modos: en claro
 * es más oscuro que el fondo de página, en oscuro es más claro. Es donde viven
 * menús y tabs activos, así que es donde de verdad hay que poder leer.
 *
 *   textMuted claro  #6B7480 → #626A75   4.24 → 4.90 sobre background
 *   warning   claro  #9A6A12 → #8D6111   4.23 → 4.88 sobre background
 *   error     oscuro #E05252 → #E15757   4.35 → 4.51 sobre surface
 *
 * Los tres conservan tono y saturación exactos: solo baja o sube la luminosidad
 * entre 1 y 4 puntos. `accent` y `warm` claros se quedan como están: pasan sobre
 * background y sobre surface, y no son color de texto sobre surfaceRaised.
 */

/* ------------------------------------------------------------------ color */

/**
 * Modo oscuro (primario). Contrastes medidos sobre `background` #091319.
 */
export const dark = {
  background: '#091319', //          abismo · fondo de página
  surface: '#10202B', //             fosa · tarjetas y paneles
  surfaceRaised: '#17303E', //       corriente · menús, tabs activos
  border: '#22414F', //              bordes de control
  hairline: '#1E3441', //            divisiones sutiles
  hairlineHover: '#2C4D5D', //       hairline en hover de tarjeta
  textPrimary: '#EDF4F3', //         espuma            16.84:1
  textSecondary: '#A7BCC4', //       bruma              9.50:1
  textMuted: '#71919C', //           plancton           5.57:1  nunca bajo 13px
  accent: '#35D6C0', //              bioluz            10.31:1  interactivo
  accentHover: '#5FE3D1',
  accentOn: '#06171A', //            tinta sobre bioluz
  warm: '#F2A65A', //                arena              9.28:1  humano y conversión
  warmHover: '#F7BB7D',
  warmOn: '#2A1605', //              tinta sobre arena
  success: '#4FB477',
  warning: '#E8A33D',
  error: '#E15757', //                                 4.51:1 sobre surface
} as const;

/**
 * Modo claro. Contrastes medidos sobre `background` #F6F2EA.
 * `background` es blanco CÁLIDO: nunca #FFF como fondo de página.
 */
export const light = {
  background: '#F6F2EA', //          papel
  surface: '#FFFFFF',
  surfaceRaised: '#EFE9DE',
  border: '#E6DFD2',
  hairline: '#EBE6DC',
  hairlineHover: '#D3C8B2', //       hairline en hover de tarjeta
  textPrimary: '#0B1524', //                           16.40:1
  textSecondary: '#3D4B58',
  textMuted: '#626A75', //                             4.53:1 sobre surfaceRaised
  accent: '#0D7C6F', //              bioluz oscura      4.55:1
  accentHover: '#0C7466',
  accentOn: '#FFFFFF',
  warm: '#A65B27', //                arena oscura       4.54:1
  warmHover: '#96511F',
  warmOn: '#FFF7EE',
  success: '#0F6B52',
  warning: '#8D6111', //                               4.51:1 sobre surfaceRaised
  error: '#C0392B',
} as const;

export const colors = { dark, light } as const;

/** Marca — iguales en los dos modos. */
export const brand = {
  /** Cuerpo de la mascota. 4.22:1 → SOLO relleno, NUNCA texto. */
  body: '#3E7CB1',
  /** Patrón de manchas. */
  spots: '#C2D7E7',
  /** Casco · contorno y fondo de bloques de código. */
  hull: '#0B1524',
} as const;

/* ------------------------------------------------------------- tipografía */

export const fonts = {
  /** SOLO titulares y números grandes. Nunca cuerpo. */
  display: '"Bricolage Grotesque", ui-sans-serif, system-ui, sans-serif',
  /** Cuerpo e interfaz. */
  sans: '"Geist", ui-sans-serif, system-ui, sans-serif',
  /** Código, rutas, etiquetas, metadatos, firma CLI. */
  mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
} as const;

export const typeScale = {
  display: { family: 'display', size: 76, lineHeight: 0.96, weight: 800, tracking: '-0.035em' },
  h1: { family: 'display', size: 44, lineHeight: 1.05, weight: 700, tracking: '-0.03em' },
  h2: { family: 'display', size: 30, lineHeight: 1.1, weight: 600, tracking: '-0.02em' },
  h3: { family: 'display', size: 25, lineHeight: 1.15, weight: 600, tracking: '-0.02em' },
  body: { family: 'sans', size: 18, lineHeight: 1.75, weight: 400 },
  ui: { family: 'sans', size: 15, lineHeight: 1.6, weight: 400 },
  label: { family: 'sans', size: 13, lineHeight: 1.5, weight: 500 },
  eyebrow: { family: 'mono', size: 12, tracking: '0.12em', transform: 'uppercase' },
} as const;

/** Límites duros de legibilidad. */
export const limits = {
  /** Mínimo absoluto en pantalla. */
  minScreenPx: 13,
  /** Mínimo absoluto impreso. */
  minPrintPt: 12,
  /** Medida máxima de cuerpo. */
  measure: '68ch',
} as const;

/* --------------------------------------------------------- forma y ritmo */

export const radius = {
  chip: 6,
  control: 10,
  card: 14,
  panel: 16,
  pill: 999,
} as const;

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 26,
  xl: 40,
  section: 96,
} as const;

export const size = {
  /** Alto de la barra de navegación. */
  nav: 64,
  /** Ancho de columna de lectura. */
  content: 760,
  /** Ancho máximo de página. */
  wide: 1180,
} as const;

/** Un solo nivel. No hay escala de elevación. */
export const shadow = {
  standard: '0 1px 2px rgba(0, 0, 0, 0.35)',
} as const;

/**
 * 150ms ease-out — solo color y borde.
 * El sistema no anima posición ni escala: los estados se comunican con borde
 * y color, no con movimiento.
 */
export const motion = {
  duration: '150ms',
  easing: 'ease-out',
  properties: 'color, background-color, border-color, fill, stroke',
} as const;

/* ------------------------------------------------------------ voz y marca */

export const tagline = {
  /** Hero. */
  largo: 'Ayudo a equipos de ingeniería a escalar con criterio',
  /** Header, una línea. */
  corto: 'Ayudo a equipos a escalar con criterio',
  /** LinkedIn. */
  en: 'Helping engineering teams scale with judgment',
} as const;

/**
 * El wordmark siempre dice «Eduardo Álvarez». La mascota se llama Tiburoncín
 * y nunca aparece escrita dentro del logo.
 */
export const naming = {
  wordmark: 'Eduardo Álvarez',
  mascot: 'Tiburoncín',
} as const;

export type ColorMode = keyof typeof colors;
export type ColorToken = keyof typeof dark;
export type BrandToken = keyof typeof brand;
export type FontToken = keyof typeof fonts;
export type TypeScaleToken = keyof typeof typeScale;
export type RadiusToken = keyof typeof radius;
export type SpacingToken = keyof typeof spacing;
export type SizeToken = keyof typeof size;
