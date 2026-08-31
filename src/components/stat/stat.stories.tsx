import type { Meta, StoryObj } from '@storybook/react-vite';

import { Nota } from '../../../stories/utils.tsx';
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
