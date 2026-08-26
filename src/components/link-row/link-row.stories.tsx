import type { Meta, StoryObj } from '@storybook/react-vite';

import { Nota } from '../../../stories/utils.tsx';
import { ArrowUpRight } from '../../lib/glyphs.tsx';
import { LinkRow } from './index.tsx';

const meta = {
  title: 'Componentes/LinkRow',
  component: LinkRow,
  args: { href: '#', name: 'GitHub', description: 'github.com/Proskynete', external: true },
} satisfies Meta<typeof LinkRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Lista: Story = {
  render: (args) => (
    <div className="gap-xs max-w-content flex flex-col">
      <LinkRow {...args} />
      <LinkRow {...args} name="LinkedIn" description="in/eduardo-alvarez" />
      <LinkRow {...args} name="Cursos" description="cursos.eduardoalvarez.dev" icon={<ArrowUpRight />} />
      <LinkRow {...args} name="Sin descripción" description={undefined} external={false} />
    </div>
  ),
};

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  render: (args) => (
    <div className="max-w-content">
      <LinkRow {...args} />
      <Nota>
        El original en `links` escalaba la tarjeta al 102 %, subía el título un
        píxel y giraba y agrandaba el icono. Aquí el hover cambia el borde y el
        color, y nada más.
      </Nota>
    </div>
  ),
};
