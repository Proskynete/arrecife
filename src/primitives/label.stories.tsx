import type { Meta, StoryObj } from '@storybook/react-vite';

import { Stack } from '../../stories/utils.tsx';
import { Checkbox } from './checkbox.tsx';
import { Input } from './input.tsx';
import { Label } from './label.tsx';

const meta = { title: 'Primitives/Label', component: Label } satisfies Meta<typeof Label>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithField: Story = {
  name: 'With field',
  render: () => (
    <Stack>
      <div className="gap-step-xs flex flex-col">
        <Label htmlFor="email">Email</Label>
        <Input id="email" placeholder="name@dominio.dev" />
      </div>
    </Stack>
  ),
};

export const WithCheckbox: Story = {
  name: 'With checkbox',
  render: () => (
    <Stack>
      <div className="gap-step-sm flex items-center">
        <Checkbox id="boletin" className="peer" />
        <Label htmlFor="boletin">Recibir el boletín</Label>
      </div>
    </Stack>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Stack>
      <div className="gap-step-xs flex flex-col">
        <Input id="bloqueado" disabled placeholder="No editable" className="peer order-2" />
        <Label htmlFor="bloqueado" className="order-1">
          Se atenúa con el control
        </Label>
      </div>
    </Stack>
  ),
};
