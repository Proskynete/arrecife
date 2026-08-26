import type { Meta, StoryObj } from '@storybook/react-vite';

import { Bloque, Nota, Pila } from '../../stories/utils.tsx';
import { Progress } from './progress.tsx';

const meta = {
  title: 'Primitivos/Progress',
  component: Progress,
  args: { value: 45, label: 'Progreso del curso' },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: (args) => <Pila><Progress {...args} /></Pila> };

export const Escala: Story = {
  render: () => (
    <Pila>
      {[0, 25, 50, 75, 100].map((v) => (
        <Bloque key={v} titulo={`${v}%`}>
          <Progress value={v} label={`Progreso del curso: ${v}%`} />
        </Bloque>
      ))}
    </Pila>
  ),
};

export const Arena: Story = {
  render: (args) => (
    <Pila>
      <Progress {...args} tone="warm" />
      <Nota>
        Arena para progreso de curso, que es humano y es conversión. Bioluz para
        todo lo demás.
      </Nota>
    </Pila>
  ),
};
