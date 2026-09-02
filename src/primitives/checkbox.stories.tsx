import type { Meta, StoryObj } from '@storybook/react-vite';

import { FieldLabel, Row } from '../../stories/utils.tsx';
import { Checkbox } from './checkbox.tsx';

const meta = { title: 'Primitives/Checkbox', component: Checkbox } satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

const withLabel = (args: Parameters<NonNullable<Story['render']>>[0]) => (
  <Row>
    <Checkbox id="boletin" {...args} />
    <FieldLabel htmlFor="boletin">Recibir el boletín</FieldLabel>
  </Row>
);

export const Default: Story = { render: withLabel };
export const Marked: Story = { args: { checked: true }, render: withLabel };
export const Indeterminate: Story = { args: { checked: 'indeterminate' }, render: withLabel };
export const Hover: Story = { parameters: { pseudo: { hover: true } }, render: withLabel };
export const Focus: Story = { parameters: { pseudo: { focusVisible: true } }, render: withLabel };
export const Disabled: Story = { args: { disabled: true, checked: true }, render: withLabel };
