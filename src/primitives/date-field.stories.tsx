import type { Meta, StoryObj } from '@storybook/react-vite';

import { Note, Stack } from '../../stories/utils.tsx';
import { DateField } from './date-field.tsx';
import { Label } from './label.tsx';

const meta = {
  title: 'Primitives/DateField',
  component: DateField,
  args: { defaultValue: '2026-03-14' },
} satisfies Meta<typeof DateField>;

export default meta;
type Story = StoryObj<typeof meta>;

const field = (args: Parameters<NonNullable<Story['render']>>[0], label = 'Publicar el artículo') => (
  <Stack>
    <div className="gap-step-xs flex flex-col">
      <Label htmlFor="date">{label}</Label>
      <DateField id="date" {...args} />
    </div>
  </Stack>
);

export const Default: Story = { render: (args) => field(args) };

export const WithTime: Story = {
  name: 'With time',
  args: { withTime: true, defaultValue: '2026-03-14T09:30' },
  render: (args) => field(args, 'Publicar el artículo'),
};

export const Invalid: Story = {
  name: 'Invalid',
  args: { invalid: true },
  render: (args) => field(args),
};

export const Disabled: Story = { args: { disabled: true }, render: (args) => field(args) };

export const WhyNative: Story = {
  name: 'Why the native control',
  render: (args) => (
    <>
      {field(args)}
      <Note>
        It brings the system keyboard, the format matching the user's language and
        screen-reader support for free. For picking a date inside a form it beats
        any bespoke calendar, and it drags in no dependencies. When a navigable
        month calendar is needed — the content planner — that is what `Calendar` is
        for.
      </Note>
    </>
  ),
};
