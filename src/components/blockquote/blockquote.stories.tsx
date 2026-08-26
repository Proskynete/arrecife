import type { Meta, StoryObj } from '@storybook/react-vite';

import { Pila } from '../../../stories/utils.tsx';
import { Blockquote } from './index.tsx';

const meta = {
  title: 'Componentes/Blockquote',
  component: Blockquote,
  args: {
    children:
      'La arquitectura no se decide en una pizarra, se decide en las mil veces que alguien elige el atajo o no lo elige.',
  },
} satisfies Meta<typeof Blockquote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: (args) => <Pila><Blockquote {...args} /></Pila> };

export const ConAutoria: Story = {
  name: 'Con autoría',
  args: { author: 'Eduardo Álvarez', source: 'Escalar sin romper el equipo, JSConf 2025' },
  render: (args) => <Pila><Blockquote {...args} /></Pila>,
};
