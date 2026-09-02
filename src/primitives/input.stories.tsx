import type { Meta, StoryObj } from '@storybook/react-vite';

import { FieldLabel, Stack } from '../../stories/utils.tsx';
import { Input } from './input.tsx';

const meta = {
  title: 'Primitives/Input',
  component: Input,
  args: { placeholder: 'name@dominio.dev' },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

const withLabel = (args: Parameters<NonNullable<Story['render']>>[0]) => (
  <Stack>
    <div className="gap-step-xs flex flex-col">
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input id="email" {...args} />
    </div>
  </Stack>
);

export const Default: Story = { render: withLabel };
export const WithValue: Story = { args: { defaultValue: 'soy@eduardoalvarez.dev' }, render: withLabel };
export const Hover: Story = { parameters: { pseudo: { hover: true } }, render: withLabel };
export const Focus: Story = { parameters: { pseudo: { focusVisible: true } }, render: withLabel };
export const Invalid: Story = {
  name: 'Invalid',
  args: { invalid: true, defaultValue: 'no-es-un-correo' },
  render: withLabel,
};
export const Disabled: Story = { args: { disabled: true }, render: withLabel };
