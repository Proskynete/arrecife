import type { Meta, StoryObj } from '@storybook/react-vite';

import { Stack } from '../../../stories/utils.tsx';
import { Blockquote } from './index.tsx';

const meta = {
  title: 'Components/Blockquote',
  component: Blockquote,
  args: {
    children:
      'La arquitectura no se decide en una pizarra, se decide en las mil veces que alguien elige el atajo o no lo elige.',
  },
} satisfies Meta<typeof Blockquote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: (args) => <Stack><Blockquote {...args} /></Stack> };

export const WithByline: Story = {
  name: 'With byline',
  args: { author: 'Eduardo Álvarez', source: 'Escalar sin romper el equipo, JSConf 2025' },
  render: (args) => <Stack><Blockquote {...args} /></Stack>,
};
