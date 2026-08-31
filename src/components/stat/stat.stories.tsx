import type { Meta, StoryObj } from '@storybook/react-vite';

import { Nota } from '../../../stories/utils.tsx';
import { ArrowUpRight, Check, Ellipsis } from '../../lib/glyphs.tsx';
import { Stat } from './index.tsx';

const meta = {
  title: 'Componentes/Stat',
  component: Stat,
  args: { value: '12', label: 'aplicaciones' },
} satisfies Meta<typeof Stat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Metricas: Story = {
  name: 'Métricas de charla',
  render: () => (
    <>
      <div className="gap-step-md grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
        <Stat value="12" label="aplicaciones" />
        <Stat value="4h 20m" label="duración" />
        <Stat value="0" label="design system" tone="alerta" />
      </div>
      <Nota>
        La regla no es de estilo, es de semántica: bioluz para lo neutro y arena
        SOLO cuando el número es el problema. Un 12 de aplicaciones es un dato; un
        0 de design systems es el problema del que trata la charla. Por eso `tone`
        tiene dos valores y no una paleta abierta.
      </Nota>
    </>
  ),
};

export const ConProgreso: Story = {
  name: 'Con progreso',
  render: () => (
    <div className="gap-step-md grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
      <Stat value="38%" label="progreso del curso" progress={38} />
    </div>
  ),
};

export const ConIconoYBajada: Story = {
  name: 'Con icono y bajada',
  render: () => (
    <div className="gap-step-md grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
      <Stat
        icon={<ArrowUpRight />}
        label="aplicaciones"
        value="12"
        description="Repartidas en cuatro equipos, ninguno con dueño declarado."
      />
      <Stat
        icon={<Ellipsis />}
        label="design systems"
        value="0"
        tone="alerta"
        description="Cada aplicación resuelve sus botones por su cuenta."
      />
      <Stat
        icon={<Check />}
        label="cobertura"
        value="68%"
        progress={68}
        description="Sube diez puntos desde el trimestre pasado."
      />
    </div>
  ),
};

export const OrdenDeLectura: Story = {
  name: 'Por qué el número va en medio',
  render: () => (
    <div className="max-w-content">
      <Stat
        icon={<ArrowUpRight />}
        label="aplicaciones"
        value="12"
        description="Repartidas en cuatro equipos, ninguno con dueño declarado."
      />
      <Nota>
        Arriba de qué va, en medio cuánto, abajo el matiz. El número no va al
        final a propósito: es lo que se viene a leer, y una bajada de dos líneas
        entre el título y la cifra la entierra.
      </Nota>
      <Nota>
        El icono hereda `currentColor`, así que sigue al tono del título y no hay
        que teñirlo aparte. Sale de `lib/glyphs.tsx`, que no se publica: el
        proyecto pasa el suyo.
      </Nota>
    </div>
  ),
};
