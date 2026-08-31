import type { Meta, StoryObj } from '@storybook/react-vite';

import { Pila } from '../../stories/utils.tsx';
import { Checkbox } from './checkbox.tsx';
import { Input } from './input.tsx';
import { Label } from './label.tsx';

const meta = { title: 'Primitivos/Label', component: Label } satisfies Meta<typeof Label>;
export default meta;
type Story = StoryObj<typeof meta>;

export const ConCampo: Story = {
  name: 'Con campo',
  render: () => (
    <Pila>
      <div className="gap-step-xs flex flex-col">
        <Label htmlFor="correo">Correo</Label>
        <Input id="correo" placeholder="nombre@dominio.dev" />
      </div>
    </Pila>
  ),
};

export const ConCasilla: Story = {
  name: 'Con casilla',
  render: () => (
    <Pila>
      <div className="gap-step-sm flex items-center">
        <Checkbox id="boletin" className="peer" />
        <Label htmlFor="boletin">Recibir el boletín</Label>
      </div>
    </Pila>
  ),
};

export const Deshabilitado: Story = {
  render: () => (
    <Pila>
      <div className="gap-step-xs flex flex-col">
        <Input id="bloqueado" disabled placeholder="No editable" className="peer order-2" />
        <Label htmlFor="bloqueado" className="order-1">
          Se atenúa con el control
        </Label>
      </div>
    </Pila>
  ),
};
