import type { Meta, StoryObj } from '@storybook/react-vite';

import { FieldLabel } from '../../stories/utils.tsx';
import { RadioGroup, RadioGroupItem } from './radio-group.tsx';

const meta = {
  title: 'Primitives/RadioGroup',
  component: RadioGroup,
  args: { defaultValue: 'mensual' },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const OPTIONS = [
  { value: 'mensual', text: 'Mensual' },
  { value: 'anual', text: 'Anual' },
  { value: 'nunca', text: 'No submit' },
];

const group = (args: Parameters<NonNullable<Story['render']>>[0]) => (
  <RadioGroup {...args}>
    {OPTIONS.map(({ value, text }) => (
      <div key={value} className="gap-step-sm flex items-center">
        <RadioGroupItem value={value} id={value} />
        <FieldLabel htmlFor={value}>{text}</FieldLabel>
      </div>
    ))}
  </RadioGroup>
);

export const Default: Story = { render: group };
export const Hover: Story = { parameters: { pseudo: { hover: true } }, render: group };
export const Focus: Story = { parameters: { pseudo: { focusVisible: true } }, render: group };
export const Disabled: Story = { args: { disabled: true }, render: group };
