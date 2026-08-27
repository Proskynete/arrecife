import type { Meta, StoryObj } from '@storybook/react-vite';

import { Nota } from '../../../stories/utils.tsx';
import { TableOfContents } from './index.tsx';

const meta = {
  title: 'Componentes/TableOfContents',
  component: TableOfContents,
  args: {
    activeHref: '#la-arquitectura',
    items: [
      { href: '#el-problema', label: 'El problema' },
      { href: '#la-arquitectura', label: 'La arquitectura' },
      { href: '#el-contrato', label: 'El contrato de rutas', nested: true },
      { href: '#cuando-no', label: 'Cuándo NO usarlos' },
      { href: '#el-marco', label: 'El marco de decisión' },
    ],
  },
} satisfies Meta<typeof TableOfContents>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basico: Story = {
  name: 'Básico',
  render: (args) => (
    <div className="max-w-60">
      <TableOfContents {...args} />
      <Nota>
        Es un `nav` con nombre accesible propio. En una página que ya tiene la
        barra del sitio y las migas, un tercer grupo de enlaces sin nombre es
        indistinguible de los otros dos para quien navega por landmarks.
      </Nota>
      <Nota>
        La sección activa lleva `aria-current="location"` además del color: no se
        puede comunicar solo con bioluz.
      </Nota>
    </div>
  ),
};
