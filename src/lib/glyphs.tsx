/**
 * Los glifos son SVG, nunca emoji ni una fuente de iconos. Son los seis que
 * los primitivos necesitan de verdad; no es una librería de iconos y no crece
 * salvo que un primitivo nuevo lo pida.
 *
 * Todos heredan `currentColor` y miden 1em, así que el color y el tamaño los
 * manda el token del contexto donde se montan.
 */
import type { SVGProps } from 'react';

type GlyphProps = SVGProps<SVGSVGElement>;

function Glyph({ children, ...props }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const Check = (props: GlyphProps) => (
  <Glyph {...props}>
    <path d="M3 8.5 6.5 12 13 4.5" />
  </Glyph>
);

export const Minus = (props: GlyphProps) => (
  <Glyph {...props}>
    <path d="M3.5 8h9" />
  </Glyph>
);

export const ChevronDown = (props: GlyphProps) => (
  <Glyph {...props}>
    <path d="M4 6l4 4 4-4" />
  </Glyph>
);

export const ChevronUp = (props: GlyphProps) => (
  <Glyph {...props}>
    <path d="M4 10l4-4 4 4" />
  </Glyph>
);

export const ChevronLeft = (props: GlyphProps) => (
  <Glyph {...props}>
    <path d="M10 4L6 8l4 4" />
  </Glyph>
);

export const ChevronRight = (props: GlyphProps) => (
  <Glyph {...props}>
    <path d="M6 4l4 4-4 4" />
  </Glyph>
);

export const Close = (props: GlyphProps) => (
  <Glyph {...props}>
    <path d="M4 4l8 8M12 4l-8 8" />
  </Glyph>
);

export const Copy = (props: GlyphProps) => (
  <Glyph {...props}>
    <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
    <path d="M10.5 3.5h-7a1.5 1.5 0 0 0-1.5 1.5v7" />
  </Glyph>
);

export const ArrowUpRight = (props: GlyphProps) => (
  <Glyph {...props}>
    <path d="M5 11l6-6M5.5 5h5.5v5.5" />
  </Glyph>
);

export const Ellipsis = (props: GlyphProps) => (
  <Glyph {...props} strokeWidth={2.25}>
    <path d="M4 8h.01M8 8h.01M12 8h.01" />
  </Glyph>
);

/**
 * La única excepción a «nada de movimiento»: un botón cargando sin girar es
 * indistinguible de uno deshabilitado. Es realimentación de progreso, no de
 * estado, y `motion-safe` la apaga para quien pidió menos movimiento.
 */
export const Spinner = (props: GlyphProps) => (
  <svg
    viewBox="0 0 16 16"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    aria-hidden="true"
    focusable="false"
    className="motion-safe:animate-spin"
    {...props}
  >
    <circle cx="8" cy="8" r="6" opacity={0.3} />
    <path d="M8 2a6 6 0 0 1 6 6" />
  </svg>
);

/**
 * La cámara del control de subida de avatar. Entra porque un primitivo nuevo la
 * pide, que es la única razón por la que este archivo crece.
 */
export const Camara = (props: GlyphProps) => (
  <Glyph {...props}>
    <path d="M2 5.5h2.6l1-1.5h4.8l1 1.5H14v7.5H2z" />
    <circle cx="8" cy="9" r="2.4" />
  </Glyph>
);

/* -------------------------------------------------------------------- tema */

/**
 * Los dos del control de tema. Se dibujan a 16 como el resto, y el sol lleva
 * los rayos como un solo `path` para que herede el grosor de `Glyph` sin
 * excepciones.
 */
export const Sol = (props: GlyphProps) => (
  <Glyph {...props}>
    <circle cx="8" cy="8" r="3" />
    <path d="M8 1.5v1.2M8 13.3v1.2M14.5 8h-1.2M2.7 8H1.5M12.6 3.4l-.85.85M4.25 11.75l-.85.85M12.6 12.6l-.85-.85M4.25 4.25l-.85-.85" />
  </Glyph>
);

export const Luna = (props: GlyphProps) => (
  <Glyph {...props}>
    <path d="M13.5 9.4A5.8 5.8 0 0 1 6.6 2.5a5.8 5.8 0 1 0 6.9 6.9Z" />
  </Glyph>
);

/* ------------------------------------------------------------------ media */

/**
 * Los ocho glifos del reproductor, traídos tal cual desde
 * `eduardoalvarez.dev/src/assets/icons`. Los trazados no se retocaron: son los
 * mismos que ya se ven en el portafolio.
 *
 * Van en viewBox 24 y no en 16 como el resto, porque así estaban dibujados y
 * reescalarlos a mano habría cambiado el grosor de línea.
 */
function GlifoMedia({ children, ...props }: GlyphProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const Play = (props: GlyphProps) => (
  <GlifoMedia fill="currentColor" {...props}>
    <path d="M8 5v14l11-7z" />
  </GlifoMedia>
);

export const Pause = (props: GlyphProps) => (
  <GlifoMedia fill="currentColor" {...props}>
    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
  </GlifoMedia>
);

export const Retry = (props: GlyphProps) => (
  <GlifoMedia
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </GlifoMedia>
);

export const GoBackSeconds = (props: GlyphProps) => (
  <GlifoMedia stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...props}>
    <path d="M16.5 8.5H13.8604C13.6452 8.5 13.4541 8.63772 13.386 8.84189L12.7194 10.8419C12.6114 11.1657 12.8524 11.5 13.1937 11.5H14.5C15.6046 11.5 16.5 12.3954 16.5 13.5C16.5 14.6046 15.6046 15.5 14.5 15.5H12.5" />
    <path d="M7.5 10.5L10 8.5V15.5" strokeLinejoin="round" />
    <path
      d="M14 4.5L12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C8.7288 22 5.82446 20.4293 4 18.001M8 2.83209C6.87754 3.32251 5.86251 4.01303 5 4.85857C3.14864 6.67349 2 9.20261 2 12C2 12.6849 2.06886 13.3538 2.20004 14"
      strokeLinejoin="round"
    />
  </GlifoMedia>
);

export const AdvanceSeconds = (props: GlyphProps) => (
  <GlifoMedia stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...props}>
    <path d="M16.5 8.5H13.8604C13.6452 8.5 13.4541 8.63772 13.386 8.84189L12.7194 10.8419C12.6114 11.1657 12.8524 11.5 13.1937 11.5H14.5C15.6046 11.5 16.5 12.3954 16.5 13.5C16.5 14.6046 15.6046 15.5 14.5 15.5H12.5" />
    <path d="M7.5 10.5L10 8.5V15.5" strokeLinejoin="round" />
    <path
      d="M10 4.5L12 2C6.47715 2 2 6.47715 2 12C2 12.6849 2.06886 13.3538 2.20004 14M16 2.83209C19.5318 4.3752 22 7.89936 22 12C22 17.5228 17.5228 22 12 22C8.72852 22 5.82443 20.4287 4 18"
      strokeLinejoin="round"
    />
  </GlifoMedia>
);

export const VolumeOn = (props: GlyphProps) => (
  <GlifoMedia fill="currentColor" {...props}>
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
  </GlifoMedia>
);

export const VolumeMuted = (props: GlyphProps) => (
  <GlifoMedia fill="currentColor" {...props}>
    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
  </GlifoMedia>
);
