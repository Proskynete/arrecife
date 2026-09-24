import type { Meta, StoryObj } from '@storybook/react-vite';

import { Stack } from '../../../stories/utils.tsx';
import { Blockquote } from './index.tsx';

const meta = {
  title: 'Components/Blockquote',
  component: Blockquote,
  args: {
    children:
      'La IA es una herramienta. No le puedo culpar al martillo si la casa no quedó bien construida: soy yo el que maneja la herramienta, no al revés.',
  },
} satisfies Meta<typeof Blockquote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: (args) => <Stack><Blockquote {...args} /></Stack> };

export const WithByline: Story = {
  name: 'With byline',
  args: { author: 'Eduardo Álvarez', source: 'Cómo pienso, eduardoalvarez.dev' },
  render: (args) => <Stack><Blockquote {...args} /></Stack>,
};
