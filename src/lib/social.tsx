/**
 * Los ocho iconos del pie, y solo del pie.
 *
 * Viven aparte de `glyphs.tsx` a propósito: aquel es el juego mínimo que
 * necesitan los primitivos y no crece; este es un inventario de terceros que sí
 * va a cambiar cuando cambien las redes. Mezclarlos habría vuelto a `glyphs` una
 * librería de iconos, que es justo lo que el sistema decidió no tener.
 *
 * La regla del documento, y es una regla de dibujo, no de estilo: las MARCAS van
 * en sólido (`fill`) y los FUNCIONALES en trazo de 1.6. Una marca es su silueta
 * —el logo de GitHub no existe en outline—, y un icono funcional es un símbolo,
 * que en este sistema se dibuja con línea.
 *
 * Todos miden 1em y heredan `currentColor`, así que el color y el tamaño los
 * manda el contexto: en el pie, 19px en plancton con hover a bioluz.
 *
 * Ninguno lleva texto visible, así que ninguno lleva título dentro del SVG: el
 * nombre accesible lo pone el `aria-label` del enlace que los envuelve, que es
 * obligatorio en el tipo `Red` de `Footer`.
 */
import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

/** Marca: silueta sólida. */
function Marca({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

/** Funcional: trazo 1.6, el grosor del documento. */
function Funcional({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
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

/* ------------------------------------------------------------------ marcas */

export const GitHub = (props: IconProps) => (
  <Marca {...props}>
    <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.91c.58.1.79-.25.79-.55 0-.27-.01-1.18-.02-2.14-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.2.66.79.55A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
  </Marca>
);

export const LinkedIn = (props: IconProps) => (
  <Marca {...props}>
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.71h.05a4.17 4.17 0 0 1 3.75-2.06c4.01 0 4.75 2.64 4.75 6.07V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21h-3.97V9Z" />
  </Marca>
);

export const X = (props: IconProps) => (
  <Marca {...props}>
    <path d="M17.53 3h3.06l-6.69 7.64L21.75 21h-6.16l-4.83-6.3L5.25 21H2.19l7.15-8.17L2.5 3h6.32l4.36 5.77L17.53 3Zm-1.07 16.17h1.7L7.62 4.74H5.8l10.66 14.43Z" />
  </Marca>
);

export const Instagram = (props: IconProps) => (
  <Marca {...props}>
    <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 3.68a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32Zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z" />
  </Marca>
);

export const Discord = (props: IconProps) => (
  <Marca {...props}>
    <path d="M20.32 5.56A18.5 18.5 0 0 0 15.7 4.1a.07.07 0 0 0-.07.04c-.2.36-.42.82-.58 1.19a17 17 0 0 0-5.1 0c-.16-.38-.39-.83-.59-1.19a.07.07 0 0 0-.07-.04c-1.6.28-3.15.77-4.62 1.46a.06.06 0 0 0-.03.03C1.66 10 .9 14.28 1.28 18.5a.08.08 0 0 0 .03.05 18.6 18.6 0 0 0 5.6 2.84.07.07 0 0 0 .08-.03c.43-.59.81-1.21 1.14-1.86a.07.07 0 0 0-.04-.1c-.6-.23-1.18-.51-1.74-.83a.07.07 0 0 1-.01-.12l.35-.27a.07.07 0 0 1 .07-.01 13.3 13.3 0 0 0 11.3 0 .07.07 0 0 1 .08.01l.34.27c.04.04.04.1-.01.12-.55.33-1.13.6-1.74.83a.07.07 0 0 0-.04.1c.34.65.72 1.27 1.14 1.86a.07.07 0 0 0 .08.03 18.5 18.5 0 0 0 5.6-2.84.07.07 0 0 0 .04-.05c.45-4.88-.75-9.12-3.18-12.88a.06.06 0 0 0-.03-.03ZM8.4 15.93c-1.1 0-2.01-1.01-2.01-2.25 0-1.24.89-2.25 2.01-2.25 1.13 0 2.03 1.02 2.02 2.25 0 1.24-.9 2.25-2.02 2.25Zm7.22 0c-1.1 0-2.01-1.01-2.01-2.25 0-1.24.89-2.25 2.01-2.25 1.13 0 2.03 1.02 2.02 2.25 0 1.24-.89 2.25-2.02 2.25Z" />
  </Marca>
);

export const YouTube = (props: IconProps) => (
  <Marca {...props}>
    <path d="M23.5 6.9a3 3 0 0 0-2.12-2.12C19.5 4.27 12 4.27 12 4.27s-7.5 0-9.38.51A3 3 0 0 0 .5 6.9 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.1 3 3 0 0 0 2.12 2.12c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3 3 0 0 0 2.12-2.12A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.1ZM9.6 15.6V8.4l6.24 3.6-6.24 3.6Z" />
  </Marca>
);

/* -------------------------------------------------------------- funcionales */

export const Rss = (props: IconProps) => (
  <Funcional {...props}>
    <path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16" />
    <circle cx="5" cy="19" r="1.6" fill="currentColor" stroke="none" />
  </Funcional>
);

export const Correo = (props: IconProps) => (
  <Funcional {...props}>
    <rect x="2.75" y="4.75" width="18.5" height="14.5" rx="2" />
    <path d="m3.5 7.5 7.4 5.2a2 2 0 0 0 2.2 0l7.4-5.2" />
  </Funcional>
);
