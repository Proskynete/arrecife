import type { Meta, StoryObj } from '@storybook/react-vite';

import { Etiqueta, Fila } from '../../stories/utils.tsx';
import { Checkbox } from './checkbox.tsx';

const meta = { title: 'Primitivos/Checkbox', component: Checkbox } satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

const conEtiqueta = (args: Parameters<NonNullable<Story['render']>>[0]) => (
  <Fila>
    <Checkbox id="boletin" {...args} />
    <Etiqueta htmlFor="boletin">Recibir el boletín</Etiqueta>
  </Fila>
);

export const Default: Story = { render: conEtiqueta };
export const Marcado: Story = { args: { checked: true }, render: conEtiqueta };
export const Indeterminado: Story = { args: { checked: 'indeterminate' }, render: conEtiqueta };
export const Hover: Story = { parameters: { pseudo: { hover: true } }, render: conEtiqueta };
export const Focus: Story = { parameters: { pseudo: { focusVisible: true } }, render: conEtiqueta };
export const Deshabilitado: Story = { args: { disabled: true, checked: true }, render: conEtiqueta };
