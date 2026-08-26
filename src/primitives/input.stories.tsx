import type { Meta, StoryObj } from '@storybook/react-vite';

import { Etiqueta, Pila } from '../../stories/utils.tsx';
import { Input } from './input.tsx';

const meta = {
  title: 'Primitivos/Input',
  component: Input,
  args: { placeholder: 'nombre@dominio.dev' },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

const conEtiqueta = (args: Parameters<NonNullable<Story['render']>>[0]) => (
  <Pila>
    <div className="gap-xs flex flex-col">
      <Etiqueta htmlFor="correo">Correo</Etiqueta>
      <Input id="correo" {...args} />
    </div>
  </Pila>
);

export const Default: Story = { render: conEtiqueta };
export const ConValor: Story = { args: { defaultValue: 'soy@eduardoalvarez.dev' }, render: conEtiqueta };
export const Hover: Story = { parameters: { pseudo: { hover: true } }, render: conEtiqueta };
export const Focus: Story = { parameters: { pseudo: { focusVisible: true } }, render: conEtiqueta };
export const Invalido: Story = {
  name: 'Inválido',
  args: { invalid: true, defaultValue: 'no-es-un-correo' },
  render: conEtiqueta,
};
export const Deshabilitado: Story = { args: { disabled: true }, render: conEtiqueta };
