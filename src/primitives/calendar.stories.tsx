import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';

import { Note, Stack } from '../../stories/utils.tsx';
import { Button } from './button.tsx';
import { Calendar } from './calendar.tsx';
import { Popover, PopoverContent, PopoverTrigger } from './popover.tsx';

const meta = {
  title: 'Primitives/Calendar',
  component: Calendar,
  argTypes: {
    fullWidth: {
      control: 'boolean',
      description: 'Fills the container width, splitting the cells evenly.',
      table: { defaultValue: { summary: 'false' } },
    },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Fecha fija: una story no puede depender de hoy o cambia sola cada día. */
const MONTH = new Date(2026, 2, 1);
const DAY = new Date(2026, 2, 14);

export const Default: Story = {
  render: () => (
    <Stack>
      <Calendar mode="single" selected={DAY} defaultMonth={MONTH} />
      <Note>
        The month change does not slide: `animate` stays off. Days are marked with
        color and border, like the rest of the system. The language defaults to
        Spanish and is changed with `locale`.
      </Note>
    </Stack>
  ),
};

export const Range: Story = {
  render: () => (
    <Stack>
      <Calendar
        mode="range"
        defaultMonth={MONTH}
        selected={{ from: new Date(2026, 2, 9), to: new Date(2026, 2, 20) }}
      />
      <Note>The endpoints in biolume, the span between them on `surfaceRaised`.</Note>
    </Stack>
  ),
};

export const TwoMonths: Story = {
  name: 'Two months',
  render: () => <Calendar mode="single" numberOfMonths={2} defaultMonth={MONTH} selected={DAY} />,
};

export const FullWidth: Story = {
  name: 'Full width',
  render: () => (
    <div className="gap-step-lg flex flex-col">
      <div className="border-hairline rounded-card p-step-md border">
        <Calendar fullWidth mode="single" selected={DAY} defaultMonth={MONTH} />
      </div>
      <Note>
        `fullWidth` stretches the calendar to its container's width and splits the
        cells evenly. It is a planner's month view. Without it, the calendar
        measures whatever its cells measure, which is what you want inside a
        `Popover` — stretching it there would leave a huge bubble.
      </Note>
    </div>
  ),
};

export const FullWidthTwoMonths: Story = {
  name: 'Full width, two months',
  render: () => (
    <div className="border-hairline rounded-card p-step-md border">
      <Calendar fullWidth mode="range" numberOfMonths={2} defaultMonth={MONTH}
        selected={{ from: new Date(2026, 2, 9), to: new Date(2026, 3, 2) }} />
    </div>
  ),
};

function DatePicker() {
  const [date, setDate] = useState<Date | undefined>(DAY);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">
          {date ? date.toLocaleDateString('es') : 'Elegir fecha'}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" aria-label="Elegir date" className="w-auto p-step-sm">
        <Calendar mode="single" selected={date} onSelect={setDate} defaultMonth={MONTH} />
      </PopoverContent>
    </Popover>
  );
}

export const InsideAPopover: Story = {
  name: 'Inside a Popover',
  parameters: {
    a11y: { config: { rules: [{ id: 'aria-hidden-focus', enabled: false }] } },
  },
  render: () => (
    <>
      <DatePicker />
      <Note>
        There is no `DatePicker` component: it is `Popover` plus `Calendar`, and
        it is five lines. A third component that only glues together two that
        already exist is API surface to maintain for nothing.
      </Note>
    </>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button'));
  },
};
