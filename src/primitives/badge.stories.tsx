import type { Meta, StoryObj } from '@storybook/react-vite';

import { Bloque, Fila, Nota } from '../../stories/utils.tsx';
import { Badge, CategoryBadge, MetricBadge } from './badge.tsx';

const meta = { title: 'Primitivos/Badge', component: Badge } satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

const ESTADOS = ['neutral', 'accent', 'warm', 'success', 'warning', 'error'] as const;

/** Los del documento, con su texto real. */
const REALES = [
  { texto: 'Publicado', variant: 'success' },
  { texto: 'Borrador', variant: 'neutral' },
  { texto: 'Fallo de build', variant: 'error' },
  { texto: 'Archivado', variant: 'neutral' },
  { texto: 'Nuevo', variant: 'accent' },
  { texto: 'En vivo', variant: 'warm' },
] as const;

const CATEGORIAS = ['engineering-culture', 'arquitectura', 'liderazgo', 'carrera'] as const;

export const Familias: Story = {
  name: 'Las tres familias',
  render: () => (
    <>
      <Bloque titulo="categoría · píldora mono en arena">
        <Fila>
          {CATEGORIAS.map((c) => (
            <CategoryBadge key={c} active={c === 'arquitectura'}>
              {c}
            </CategoryBadge>
          ))}
        </Fila>
        <Nota>
          Son slugs, así que se leen `engineering-culture` en minúscula. La
          rellena no es decorativa: es el único indicador de filtro activo del
          listado de artículos, y por eso es la prop `active` y no un `className`
          en el sitio de uso.
        </Nota>
      </Bloque>

      <Bloque titulo="estado · cuadrada r6, sans 12.5/500, fondo al 8 %">
        <Fila>
          {REALES.map((e) => (
            <Badge key={e.texto} variant={e.variant}>
              {e.texto}
            </Badge>
          ))}
        </Fila>
        <Nota>
          Es la receta del aviso en tamaño de palabra: fondo al 8 % del semántico
          y nada más. Cuadrada de radio `chip`, no píldora — la forma es lo que la
          separa de una categoría a un metro de distancia.
        </Nota>
        <Nota>
          Sin borde. Lo llevó un tiempo y pesaba: una caja con borde al lado de un
          título se lee como un control y no como un dato. El texto va en
          `textPrimary` y no en el color del tono — cambia el modo en la toolbar:
          en claro los semánticos están calibrados para pasar JUSTO sobre papel,
          así que sobre su propio tinte caen a 4.10–4.40 y no pasan AA.
        </Nota>
        <Nota>
          El tono nunca es el único portador del significado: la etiqueta dice
          «Publicado» o «Borrador» con todas sus letras.
        </Nota>
      </Bloque>

      <Bloque titulo="métrica · mono, sin caja, sin transformar">
        <Fila>
          <MetricBadge>8 min de lectura</MetricBadge>
          <MetricBadge>6 módulos</MetricBadge>
          <MetricBadge>pose-laptop-coffee.png</MetricBadge>
          <MetricBadge boxed>v5.0.1</MetricBadge>
        </Fila>
        <Nota>
          Ninguna de las tres va en versalitas. El `uppercase` que tenían todas
          venía de `text-eyebrow`, que es la escala del antetítulo y no la de las
          etiquetas: convertía un slug en `ENGINEERING-CULTURE` y un nombre de
          archivo en uno que no existe.
        </Nota>
      </Bloque>
    </>
  ),
};

export const Estado: Story = {
  render: () => (
    <Fila>
      {ESTADOS.map((v) => (
        <Badge key={v} variant={v}>
          {v}
        </Badge>
      ))}
    </Fila>
  ),
};

export const Categoria: Story = {
  name: 'Categoría',
  render: () => (
    <Fila>
      {CATEGORIAS.map((c) => (
        <CategoryBadge key={c} active={c === 'arquitectura'}>
          {c}
        </CategoryBadge>
      ))}
    </Fila>
  ),
};

export const Metrica: Story = {
  name: 'Métrica',
  render: () => (
    <Fila>
      <MetricBadge>8 min de lectura</MetricBadge>
      <MetricBadge>18 ago 2026</MetricBadge>
      <MetricBadge boxed>v5.0.1</MetricBadge>
    </Fila>
  ),
};
