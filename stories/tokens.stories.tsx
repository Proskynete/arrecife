import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  brand,
  colors,
  fonts,
  limits,
  motion,
  radius,
  shadow,
  size,
  spacing,
  typeScale,
} from '../src/tokens/index.ts';
import type { ColorMode } from '../src/tokens/index.ts';

/* ------------------------------------------------------- contraste medido */

/** Canal sRGB linealizado, WCAG 2.1. */
function canal(v: number): number {
  const s = v / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function luminancia(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  return (
    0.2126 * canal((n >> 16) & 255) +
    0.7152 * canal((n >> 8) & 255) +
    0.0722 * canal(n & 255)
  );
}

/** Razón de contraste WCAG entre dos colores. Esta es la prueba, no el ojo. */
function contraste(a: string, b: string): number {
  const [x, y] = [luminancia(a), luminancia(b)].sort((p, q) => q - p) as [number, number];
  return (x + 0.05) / (y + 0.05);
}

const format = (n: number) => `${n.toFixed(2)}:1`;

/* ----------------------------------------- el modo activo desde la toolbar */

/** Lee el data-theme que pone el switch de la toolbar. */
function useModo(): ColorMode {
  const [modo, setModo] = useState<ColorMode>('dark');

  useEffect(() => {
    const raiz = document.documentElement;
    const leer = () => setModo(raiz.dataset['theme'] === 'light' ? 'light' : 'dark');
    leer();
    const observer = new MutationObserver(leer);
    observer.observe(raiz, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return modo;
}

/* -------------------------------------------------------------- andamiaje */

function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="mb-section">
      <h2 className="text-h2 font-display text-text-primary mb-md">{titulo}</h2>
      {children}
    </section>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-eyebrow font-mono text-text-muted uppercase mb-sm">{children}</p>
  );
}

function Pagina({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div className="bg-background text-text-primary font-sans min-h-screen px-xl py-xl">
      <div className="max-w-wide mx-auto">
        <Eyebrow>arrecife · tokens</Eyebrow>
        <h1 className="text-h1 font-display text-text-primary mb-xl">{titulo}</h1>
        {children}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- paleta */

type Clave = keyof typeof colors.dark;

/**
 * Cada grupo se mide como lo que es. Un fondo no se mide contra sí mismo: se
 * mide el texto que va a ir encima. Un borde no es texto: le basta 3:1 de AA
 * para componentes no textuales.
 */
type Medicion = 'fondo' | 'ui' | 'texto';

type Grupo = {
  titulo: string;
  medicion: Medicion;
  nota?: string;
  claves: readonly Clave[];
};

const GRUPOS: readonly Grupo[] = [
  {
    titulo: 'Fondos',
    medicion: 'fondo',
    nota: 'Se mide textPrimary encima, que es lo que de verdad hay que poder leer.',
    claves: ['background', 'surface', 'surfaceRaised'],
  },
  {
    titulo: 'Bordes',
    medicion: 'ui',
    nota: 'No son texto: el mínimo AA de componentes no textuales es 3:1.',
    claves: ['border', 'hairline'],
  },
  {
    titulo: 'Texto',
    medicion: 'texto',
    nota: 'textMuted nunca por debajo de 13px.',
    claves: ['textPrimary', 'textSecondary', 'textMuted'],
  },
  { titulo: 'Interactivo', medicion: 'texto', claves: ['accent', 'accentHover', 'accentOn'] },
  {
    titulo: 'Conversión',
    medicion: 'texto',
    nota: 'Una sola vez por pantalla.',
    claves: ['warm', 'warmHover', 'warmOn'],
  },
  { titulo: 'Estado', medicion: 'texto', claves: ['success', 'warning', 'error'] },
];

/** Los tokens que son tinta sobre otro color, no sobre el fondo de página. */
const SOBRE: Partial<Record<Clave, Clave>> = {
  accentOn: 'accent',
  warmOn: 'warm',
};

function Muestra({
  nombre,
  hex,
  contra,
  etiqueta,
  minimo,
  advertencia,
}: {
  nombre: string;
  hex: string;
  contra: string;
  etiqueta: string;
  minimo: number;
  advertencia?: string;
}) {
  const razon = contraste(hex, contra);
  const pasa = razon >= minimo;

  return (
    <div className="border-hairline rounded-card border p-md">
      <div
        className="rounded-chip mb-sm h-12 w-full border"
        style={{ backgroundColor: hex, borderColor: 'var(--color-hairline)' }}
      />
      <p className="text-label font-sans text-text-primary">{nombre}</p>
      <p className="text-eyebrow font-mono text-text-muted uppercase">{hex}</p>
      <p className="text-label font-mono mt-sm text-text-secondary">
        {format(razon)} <span className={pasa ? 'text-success' : 'text-error'}>
          {pasa ? 'AA' : `bajo ${minimo}:1`}
        </span>
      </p>
      <p className="text-eyebrow font-mono text-text-muted mt-xs uppercase">{etiqueta}</p>
      {advertencia ? (
        <p className="text-label font-sans text-warning mt-xs">{advertencia}</p>
      ) : null}
    </div>
  );
}

function Paleta() {
  const modo = useModo();
  const paleta = colors[modo];

  return (
    <Pagina titulo={`Paleta · modo ${modo === 'dark' ? 'oscuro' : 'claro'}`}>
      <p className="text-body font-sans text-text-secondary max-w-measure mb-xl">
        Los contrastes están medidos, no estimados. Cada razón de esta página se
        calcula en tiempo de render desde <code className="font-mono">tokens.ts</code>: si
        alguien cambia un hex, el número cambia aquí antes de llegar a producción.
        Cambia el modo en la toolbar y todo se recalcula.
      </p>

      {GRUPOS.map((grupo) => (
        <Seccion key={grupo.titulo} titulo={grupo.titulo}>
          {grupo.nota ? (
            <p className="text-ui font-sans text-text-muted mb-md max-w-measure">{grupo.nota}</p>
          ) : null}
          <div className="gap-md grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
            {grupo.claves.map((clave) => {
              if (grupo.medicion === 'fondo') {
                return (
                  <Muestra
                    key={clave}
                    nombre={clave}
                    hex={paleta[clave]}
                    contra={paleta.textPrimary}
                    etiqueta="textPrimary encima"
                    minimo={4.5}
                  />
                );
              }

              const par = SOBRE[clave];
              return (
                <Muestra
                  key={clave}
                  nombre={clave}
                  hex={paleta[clave]}
                  contra={par ? paleta[par] : paleta.background}
                  etiqueta={`sobre ${par ?? 'background'}`}
                  minimo={grupo.medicion === 'ui' ? 3 : 4.5}
                />
              );
            })}
          </div>
        </Seccion>
      ))}

      <Seccion titulo="Marca">
        <p className="text-ui font-sans text-text-muted mb-md max-w-measure">
          Iguales en los dos modos. Son relleno de ilustración, no paleta de interfaz.
        </p>
        <div className="gap-md grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
          <Muestra
            nombre="brand.body"
            hex={brand.body}
            contra={paleta.background}
            etiqueta="sobre background"
            minimo={3}
            advertencia="Solo relleno. Nunca texto."
          />
          <Muestra
            nombre="brand.spots"
            hex={brand.spots}
            contra={paleta.background}
            etiqueta="sobre background"
            minimo={3}
          />
          <Muestra
            nombre="brand.hull"
            hex={brand.hull}
            contra={paleta.surface}
            etiqueta="sobre surface"
            minimo={3}
          />
        </div>
      </Seccion>
    </Pagina>
  );
}

/* -------------------------------------------------- escala tipográfica */

const FAMILIA: Record<string, string> = {
  display: 'font-display',
  sans: 'font-sans',
  mono: 'font-mono',
};

const TAMANO: Record<keyof typeof typeScale, string> = {
  display: 'text-display',
  stat: 'text-stat',
  h1: 'text-h1',
  h2: 'text-h2',
  h3: 'text-h3',
  body: 'text-body',
  lead: 'text-lead',
  ui: 'text-ui',
  label: 'text-label',
  tag: 'text-tag',
  meta: 'text-meta',
  chip: 'text-chip',
  eyebrow: 'text-eyebrow uppercase',
};

const EJEMPLO: Record<keyof typeof typeScale, string> = {
  display: 'Escalar con criterio',
  stat: '46',
  h1: 'Ayudo a equipos de ingeniería a escalar con criterio',
  h2: 'Arquitectura que sobrevive al equipo que la escribió',
  h3: 'Decisiones documentadas, no heredadas',
  body: 'El sistema no anima posición ni escala. Los estados se comunican con borde y color, no con movimiento, porque el movimiento es caro de leer y barato de abusar.',
  lead: 'Bajada de página interna, diecisiete píxeles',
  ui: 'Etiqueta de interfaz, quince píxeles',
  label: 'Etiqueta mínima, trece píxeles',
  tag: 'Publicado',
  meta: '18 ago 2026 · 8 min · v5.0.1',
  chip: 'engineering-culture',
  eyebrow: 'sección',
};

function Tipografia() {
  return (
    <Pagina titulo="Escala tipográfica">
      <p className="text-body font-sans text-text-secondary max-w-measure mb-xl">
        Display solo para titulares y números grandes, nunca cuerpo. Mínimos
        absolutos: {limits.minScreenPx}px en pantalla, {limits.minPrintPt}pt impreso.
        Medida máxima de cuerpo: {limits.measure}.
      </p>

      {(Object.keys(typeScale) as (keyof typeof typeScale)[]).map((clave) => {
        const escala = typeScale[clave];
        const detalles = [
          `${escala.size}px`,
          'lineHeight' in escala ? `/ ${escala.lineHeight}` : null,
          'weight' in escala ? `/ ${escala.weight}` : null,
          'tracking' in escala ? `/ ${escala.tracking}` : null,
          fonts[escala.family as keyof typeof fonts].split(',')[0],
        ]
          .filter(Boolean)
          .join('  ');

        return (
          <div key={clave} className="border-hairline py-lg border-b last:border-b-0">
            <div className="gap-sm mb-sm flex flex-wrap items-baseline">
              <span className="text-eyebrow font-mono text-accent uppercase">{clave}</span>
              <span className="text-label font-mono text-text-muted">{detalles}</span>
            </div>
            <p
              className={`${TAMANO[clave]} ${FAMILIA[escala.family]} text-text-primary max-w-measure`}
            >
              {EJEMPLO[clave]}
            </p>
          </div>
        );
      })}
    </Pagina>
  );
}

/* ------------------------------------------------------- forma y ritmo */

function FormaYRitmo() {
  return (
    <Pagina titulo="Forma y ritmo">
      <Seccion titulo="Radio">
        <div className="gap-md flex flex-wrap">
          {(Object.keys(radius) as (keyof typeof radius)[]).map((clave) => (
            <div key={clave}>
              <div
                className="bg-surface-raised border-border h-24 w-24 border"
                style={{ borderRadius: `var(--radius-${clave})` }}
              />
              <p className="text-label font-mono text-text-secondary mt-xs">
                {clave} · {radius[clave]}
              </p>
            </div>
          ))}
        </div>
      </Seccion>

      <Seccion titulo="Espaciado">
        <div className="gap-sm flex flex-col">
          {(Object.keys(spacing) as (keyof typeof spacing)[]).map((clave) => (
            <div key={clave} className="gap-md flex items-center">
              <span className="text-label font-mono text-text-muted w-24">
                {clave} · {spacing[clave]}
              </span>
              <span
                className="bg-accent rounded-chip h-3"
                style={{ width: `var(--spacing-${clave})` }}
              />
            </div>
          ))}
        </div>
      </Seccion>

      <Seccion titulo="Medidas">
        <div className="gap-sm flex flex-col">
          {(Object.keys(size) as (keyof typeof size)[]).map((clave) => (
            <p key={clave} className="text-label font-mono text-text-secondary">
              {clave} · {size[clave]}px
            </p>
          ))}
          <p className="text-label font-mono text-text-secondary">
            measure · {limits.measure}
          </p>
        </div>
      </Seccion>

      <Seccion titulo="Sombra y movimiento">
        <div className="gap-lg flex flex-wrap items-start">
          <div className="bg-surface border-hairline rounded-card shadow-standard p-lg border">
            <p className="text-label font-mono text-text-secondary">shadow.standard</p>
            <p className="text-label font-mono text-text-muted">{shadow.standard}</p>
          </div>
          <div className="bg-surface border-hairline rounded-card p-lg border">
            <p className="text-label font-mono text-text-secondary">motion</p>
            <p className="text-label font-mono text-text-muted">
              {motion.duration} {motion.easing}
            </p>
            <p className="text-ui font-sans text-text-secondary max-w-measure mt-sm">
              Solo color y borde. Nada de escala ni desplazamiento.
            </p>
          </div>
        </div>
      </Seccion>
    </Pagina>
  );
}

/* ------------------------------------------------------------- stories */

const meta = {
  title: 'Tokens/Sistema',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;

export const Paleta_: StoryObj = { name: 'Paleta', render: () => <Paleta /> };
export const Tipografia_: StoryObj = { name: 'Tipografía', render: () => <Tipografia /> };
export const Forma_: StoryObj = { name: 'Forma y ritmo', render: () => <FormaYRitmo /> };
