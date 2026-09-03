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

/** camelCase → kebab-case, same as in `scripts/build-tokens.mjs`. */
const kebab = (name: string) => name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

/* ----------------------------------------------------- measured contrast */

/** Linearised sRGB channel, WCAG 2.1. */
function channel(v: number): number {
  const s = v / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  return (
    0.2126 * channel((n >> 16) & 255) +
    0.7152 * channel((n >> 8) & 255) +
    0.0722 * channel(n & 255)
  );
}

/** WCAG contrast ratio between two colors. This is the proof, not the eye. */
function contrast(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p) as [number, number];
  return (x + 0.05) / (y + 0.05);
}

const format = (n: number) => `${n.toFixed(2)}:1`;

/* --------------------------------------- the active mode, from the toolbar */

/** Reads the data-theme the toolbar switch sets. */
function useMode(): ColorMode {
  const [mode, setMode] = useState<ColorMode>('dark');

  useEffect(() => {
    const root = document.documentElement;
    const read = () => setMode(root.dataset['theme'] === 'light' ? 'light' : 'dark');
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return mode;
}

/* ------------------------------------------------------------ scaffolding */

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-section">
      <h2 className="text-h2 font-display text-text-primary mb-step-md">{title}</h2>
      {children}
    </section>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-eyebrow font-mono text-text-muted uppercase mb-step-sm">{children}</p>
  );
}

function Page({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-background text-text-primary font-sans min-h-screen px-step-xl py-step-xl">
      <div className="max-w-wide mx-auto">
        <Eyebrow>arrecife · tokens</Eyebrow>
        <h1 className="text-h1 font-display text-text-primary mb-step-xl">{title}</h1>
        {children}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- palette */

type Key = keyof typeof colors.dark;

/**
 * Each group is measured as what it is. A background is not measured against
 * itself: what is measured is the text going on top of it. A border is not text:
 * 3:1 is AA enough for non-text components.
 */
type Measurement = 'background' | 'ui' | 'text';

type Group = {
  title: string;
  measurement: Measurement;
  note?: string;
  keys: readonly Key[];
};

const GROUPS: readonly Group[] = [
  {
    title: 'Backgrounds',
    measurement: 'background',
    note: 'textPrimary is measured on top, which is what actually has to be readable.',
    keys: ['background', 'surface', 'surfaceRaised'],
  },
  {
    title: 'Borders',
    measurement: 'ui',
    note: 'They are not text: the AA minimum for non-text components is 3:1.',
    keys: ['border', 'hairline'],
  },
  {
    title: 'Text',
    measurement: 'text',
    note: 'textMuted never below 13px.',
    keys: ['textPrimary', 'textSecondary', 'textMuted'],
  },
  { title: 'Interactive', measurement: 'text', keys: ['accent', 'accentHover', 'accentOn'] },
  {
    title: 'Conversion',
    measurement: 'text',
    note: 'Once per screen.',
    keys: ['warm', 'warmHover', 'warmOn'],
  },
  { title: 'Status', measurement: 'text', keys: ['success', 'warning', 'error'] },
];

/** The tokens that are ink over another color, not over the page background. */
const OVER: Partial<Record<Key, Key>> = {
  accentOn: 'accent',
  warmOn: 'warm',
};

function Sample({
  name,
  hex,
  contra,
  label,
  min,
  warning,
}: {
  name: string;
  hex: string;
  contra: string;
  label: string;
  min: number;
  warning?: string;
}) {
  const ratio = contrast(hex, contra);
  const passes = ratio >= min;

  return (
    <div className="border-hairline rounded-card border p-step-md">
      <div
        className="rounded-chip mb-step-sm h-12 w-full border"
        style={{ backgroundColor: hex, borderColor: 'var(--color-hairline)' }}
      />
      <p className="text-label font-sans text-text-primary">{name}</p>
      <p className="text-eyebrow font-mono text-text-muted uppercase">{hex}</p>
      <p className="text-label font-mono mt-step-sm text-text-secondary">
        {format(ratio)} <span className={passes ? 'text-success' : 'text-error'}>
          {passes ? 'AA' : `under ${min}:1`}
        </span>
      </p>
      <p className="text-eyebrow font-mono text-text-muted mt-step-xs uppercase">{label}</p>
      {warning ? (
        <p className="text-label font-sans text-warning mt-step-xs">{warning}</p>
      ) : null}
    </div>
  );
}

function Palette() {
  const mode = useMode();
  const palette = colors[mode];

  return (
    <Page title={`Palette · ${mode} mode`}>
      <p className="text-body font-sans text-text-secondary max-w-measure mb-step-xl">
        The contrast ratios are measured, not estimated. Every ratio on this page is
        computed at render time from <code className="font-mono">tokens.ts</code>: if
        somebody changes a hex, the number changes here before it reaches
        production. Switch the mode in the toolbar and everything recalculates.
      </p>

      {GROUPS.map((group) => (
        <Section key={group.title} title={group.title}>
          {group.note ? (
            <p className="text-ui font-sans text-text-muted mb-step-md max-w-measure">{group.note}</p>
          ) : null}
          <div className="gap-step-md grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
            {group.keys.map((key) => {
              if (group.measurement === 'background') {
                return (
                  <Sample
                    key={key}
                    name={key}
                    hex={palette[key]}
                    contra={palette.textPrimary}
                    label="textPrimary on top"
                    min={4.5}
                  />
                );
              }

              const pair = OVER[key];
              return (
                <Sample
                  key={key}
                  name={key}
                  hex={palette[key]}
                  contra={pair ? palette[pair] : palette.background}
                  label={`over ${pair ?? 'background'}`}
                  min={group.measurement === 'ui' ? 3 : 4.5}
                />
              );
            })}
          </div>
        </Section>
      ))}

      <Section title="Brand">
        <p className="text-ui font-sans text-text-muted mb-step-md max-w-measure">
          Identical in both modes. They are illustration fill, not an interface palette.
        </p>
        <div className="gap-step-md grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
          <Sample
            name="brand.body"
            hex={brand.body}
            contra={palette.background}
            label="over background"
            min={3}
            warning="Fill only. Never text."
          />
          <Sample
            name="brand.spots"
            hex={brand.spots}
            contra={palette.background}
            label="over background"
            min={3}
          />
          <Sample
            name="brand.hull"
            hex={brand.hull}
            contra={palette.surface}
            label="over surface"
            min={3}
          />
        </div>
      </Section>
    </Page>
  );
}

/* ------------------------------------------------------------ type scale */

const FAMILY: Record<string, string> = {
  display: 'font-display',
  sans: 'font-sans',
  mono: 'font-mono',
};

const SIZE: Record<keyof typeof typeScale, string> = {
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

const EXAMPLE: Record<keyof typeof typeScale, string> = {
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

function Typography() {
  return (
    <Page title="Type scale">
      <p className="text-body font-sans text-text-secondary max-w-measure mb-step-xl">
        Display for headlines and large numbers only, never body. Absolute minimums:
        {' '}{limits.minScreenPx}px on screen, {limits.minPrintPt}pt in print. Maximum
        body measure: {limits.measure}.
      </p>

      {(Object.keys(typeScale) as (keyof typeof typeScale)[]).map((key) => {
        const scale = typeScale[key];
        const details = [
          `${scale.size}px`,
          'lineHeight' in scale ? `/ ${scale.lineHeight}` : null,
          'weight' in scale ? `/ ${scale.weight}` : null,
          'tracking' in scale ? `/ ${scale.tracking}` : null,
          fonts[scale.family as keyof typeof fonts].split(',')[0],
        ]
          .filter(Boolean)
          .join('  ');

        return (
          <div key={key} className="border-hairline py-step-lg border-b last:border-b-0">
            <div className="gap-step-sm mb-step-sm flex flex-wrap items-baseline">
              <span className="text-eyebrow font-mono text-accent uppercase">{key}</span>
              <span className="text-label font-mono text-text-muted">{details}</span>
            </div>
            <p
              className={`${SIZE[key]} ${FAMILY[scale.family]} text-text-primary max-w-measure`}
            >
              {EXAMPLE[key]}
            </p>
          </div>
        );
      })}
    </Page>
  );
}

/* -------------------------------------------------------- shape and rhythm */

function ShapeAndRhythm() {
  return (
    <Page title="Shape and rhythm">
      <Section title="Radius">
        <div className="gap-step-md flex flex-wrap">
          {(Object.keys(radius) as (keyof typeof radius)[]).map((key) => (
            <div key={key}>
              <div
                className="bg-surface-raised border-border h-24 w-24 border"
                style={{ borderRadius: `var(--radius-${key})` }}
              />
              <p className="text-label font-mono text-text-secondary mt-step-xs">
                {key} · {radius[key]}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Spacing">
        <p className="text-ui font-sans text-text-muted mb-step-md max-w-measure">
          All five steps carry <code className="font-mono">step</code> in the name
          because <code className="font-mono">xs</code>…<code className="font-mono">xl</code>{' '}
          are the names of Tailwind's <code className="font-mono">--container-*</code>{' '}
          scale, and <code className="font-mono">--spacing-*</code> was swallowing it: a
          project importing the tokens ended up with{' '}
          <code className="font-mono">max-w-sm</code> at 12px. See{' '}
          <code className="font-mono">tokens.ts</code>.
        </p>
        <div className="gap-step-sm flex flex-col">
          {(Object.keys(spacing) as (keyof typeof spacing)[]).map((key) => (
            <div key={key} className="gap-step-md flex items-center">
              <span className="text-label font-mono text-text-muted w-56">
                --spacing-{kebab(key)} · {spacing[key]}
              </span>
              <span
                className="bg-accent rounded-chip h-3"
                style={{ width: `var(--spacing-${kebab(key)})` }}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Measurements">
        <div className="gap-step-sm flex flex-col">
          {(Object.keys(size) as (keyof typeof size)[]).map((key) => (
            <p key={key} className="text-label font-mono text-text-secondary">
              {key} · {size[key]}px
            </p>
          ))}
          <p className="text-label font-mono text-text-secondary">
            measure · {limits.measure}
          </p>
        </div>
      </Section>

      <Section title="Shadow and motion">
        <div className="gap-step-lg flex flex-wrap items-start">
          <div className="bg-surface border-hairline rounded-card shadow-standard p-step-lg border">
            <p className="text-label font-mono text-text-secondary">shadow.standard</p>
            <p className="text-label font-mono text-text-muted">{shadow.standard}</p>
          </div>
          <div className="bg-surface border-hairline rounded-card p-step-lg border">
            <p className="text-label font-mono text-text-secondary">motion</p>
            <p className="text-label font-mono text-text-muted">
              {motion.duration} {motion.easing}
            </p>
            <p className="text-ui font-sans text-text-secondary max-w-measure mt-step-sm">
              Color and border only. No scale, no displacement.
            </p>
          </div>
        </div>
      </Section>
    </Page>
  );
}

/* ------------------------------------------------------------- stories */

const meta = {
  title: 'Tokens/System',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;

export const Palette_: StoryObj = { name: 'Palette', render: () => <Palette /> };
export const Typography_: StoryObj = { name: 'Typography', render: () => <Typography /> };
export const Shape_: StoryObj = { name: 'Shape and rhythm', render: () => <ShapeAndRhythm /> };
