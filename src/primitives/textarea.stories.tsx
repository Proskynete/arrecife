import type { Meta, StoryObj } from '@storybook/react-vite';

import { Etiqueta, Pila } from '../../stories/utils.tsx';
import { Textarea } from './textarea.tsx';

const meta = {
  title: 'Primitivos/Textarea',
  component: Textarea,
  args: { placeholder: 'Cuéntame en qué estás' },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

const conEtiqueta = (args: Parameters<NonNullable<Story['render']>>[0]) => (
  <Pila>
    <div className="gap-step-xs flex flex-col">
      <Etiqueta htmlFor="mensaje">Mensaje</Etiqueta>
      <Textarea id="mensaje" {...args} />
    </div>
  </Pila>
);

export const Default: Story = { render: conEtiqueta };
export const Hover: Story = { parameters: { pseudo: { hover: true } }, render: conEtiqueta };
export const Focus: Story = { parameters: { pseudo: { focusVisible: true } }, render: conEtiqueta };
export const Invalido: Story = { name: 'Inválido', args: { invalid: true }, render: conEtiqueta };
export const Deshabilitado: Story = { args: { disabled: true }, render: conEtiqueta };
