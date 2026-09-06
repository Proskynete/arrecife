import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Block, Note } from './utils.tsx';
import { Button } from '../src/primitives/button.tsx';
import { Calendar } from '../src/primitives/calendar.tsx';
import { DateField } from '../src/primitives/date-field.tsx';
import { Label } from '../src/primitives/label.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '../src/primitives/popover.tsx';

/**
 * Compositions that are NOT components of the library, and why they are not.
 *
 * They were asked for as new pieces and, looked at closely, they were already
 * here: primitives that assemble in four lines. A component that only puts two
 * others together encodes no identity rule — it is an alias with maintenance.
 *
 * They live here because the entry criterion says it gets decided beforehand,
 * and a decision that leaves no trace gets taken again in six months.
 *
 * There were two. The sidebar recipe left with `SidebarNav` in 0.8.0 — see
 * `docs/decisions.md` § 48 — and what it demonstrated is now moot: the piece it
 * was composed from is gone, and the two admin projects it was for each have a
 * sidebar of their own that they prefer.
 *
 * This docstring was Spanish with English swept through the middle of it — «las
 * two se pidieron», «ninguna rule de identidad», «están aquí because». It is the
 * 0.6.0 migration's other half and `check:copy` cannot see it: the check reads
 * string literals, and a comment is neither user-facing copy nor a literal. A
 * comment goes in English, whole.
 */
const meta = { title: 'Recipes/Compositions' } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function SchedulePublication() {
  const [date, setDate] = useState<Date | undefined>(new Date('2026-09-15T10:00'));

  return (
    <div className="gap-step-sm flex max-w-sm flex-col">
      <Label htmlFor="publicar">Publicar el</Label>

      <div className="gap-step-sm flex items-center">
        <DateField
          id="publicar"
          withTime
          defaultValue="2026-09-15T10:00"
          className="flex-1"
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary" size="icon" aria-label="Elegir en el calendario">
              <span aria-hidden="true">▤</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent aria-label="Calendario de publicación">
            <Calendar mode="single" selected={date} onSelect={setDate} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export const DateTimePicker: Story = {
  name: 'Scheduling a publication',
  render: () => (
    <div>
      <Block title="what was requested as a DateTimePicker">
        <SchedulePublication />
      </Block>

      <Note>
        `DateField` with `withTime` IS the date-and-time picker: it is the native
        `datetime-local`, and it brings the system keyboard, the language-aware
        format and screen-reader support for free.
      </Note>
      <Note>
        The popover's `Calendar` is optional and serves to pick by eye within a
        month. It does not replace the field: it accompanies it, because typing a
        date on the keyboard is still faster than hunting for it in a grid.
      </Note>
      <Note>
        Which is why no new component gets in: it encodes no identity rule the two
        primitives do not already encode.
      </Note>
    </div>
  ),
};
