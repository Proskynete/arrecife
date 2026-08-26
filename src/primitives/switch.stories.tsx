import type { Meta, StoryObj } from '@storybook/react-vite';

import { Etiqueta, Fila, Nota } from '../../stories/utils.tsx';
import { Switch } from './switch.tsx';

const meta = { title: 'Primitivos/Switch', component: Switch } satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;

const conEtiqueta = (args: Parameters<NonNullable<Story['render']>>[0]) => (
  <Fila>
    <Switch id="tema" {...args} />
    <Etiqueta htmlFor="tema">Modo claro</Etiqueta>
  </Fila>
);

export const Default: Story = { render: conEtiqueta };
export const Activo: Story = { args: { checked: true }, render: conEtiqueta };
export const Hover: Story = { parameters: { pseudo: { hover: true } }, render: conEtiqueta };
export const Focus: Story = { parameters: { pseudo: { focusVisible: true } }, render: conEtiqueta };
export const Deshabilitado: Story = { args: { disabled: true }, render: conEtiqueta };

export const SinAnimacion: Story = {
  name: 'Sin animación',
  render: (args) => (
    <>
      {conEtiqueta(args)}
      <Nota>
        La perilla cambia de posición al activarse, pero no se desliza: la posición
        es el estado, no una transición. Lo único que transiciona es el color de la
        vía, en 150ms ease-out.
      </Nota>
    </>
  ),
};
