import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useId, useState, type ComponentPropsWithoutRef, type FormEvent, type ReactNode } from 'react';

import { cn } from '../../lib/cn.ts';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../primitives/alert-dialog.tsx';
import { Button } from '../../primitives/button.tsx';
import { Calendar } from '../../primitives/calendar.tsx';
import { DateField } from '../../primitives/date-field.tsx';
import { Input } from '../../primitives/input.tsx';
import { Label } from '../../primitives/label.tsx';
import { Text } from '../../primitives/typography.tsx';

/**
 * The calendar with events: seeing them, creating, editing and deleting them.
 *
 * `Calendar` is the primitive and remains a grid of dates: it serves to PICK a
 * day and knows nothing about content. This is the schedule, which is why it
 * lives in `components/` and not next to that one — it has state, it has a form
 * and it encodes what a day with things in it looks like.
 *
 * It is presentational, like the rest of the library: it takes `events` and
 * emits `onCreateEvent`, `onUpdateEvent` and `onDeleteEvent`. It stores nothing,
 * calls no API and generates no ids — the id is set by whoever persists,
 * because they are the one who knows whether it comes from a database or a file.
 *
 * TWO COLUMNS and not a popover over the day. The popover is what everyone does
 * and it hides the content behind a click: with the list beside it, a month with
 * fifteen events reads at a glance and the selected day does not cover the grid.
 * On a narrow screen they stack.
 *
 * Deleting goes through `AlertDialog` and not through a direct button. It is
 * precisely the case it exists for: a destructive action with no undo.
 */
export type CalendarEvent = {
  /** Set by the project. The library never invents it. */
  id: string;
  /** When it starts, with a time. */
  start: Date;
  title: string;
  /** `warm` when the event is the problem, same as in `Stat`. */
  tone?: 'accent' | 'warm' | undefined;
};

export type EventCalendarProps = Omit<ComponentPropsWithoutRef<'div'>, 'onSelect' | 'children'> & {
  events: readonly CalendarEvent[];
  /** Without it, the schedule is read-only and the form is not painted. */
  onCreateEvent?: ((event: Omit<CalendarEvent, 'id'>) => void) | undefined;
  onUpdateEvent?: ((event: CalendarEvent) => void) | undefined;
  onDeleteEvent?: ((id: string) => void) | undefined;
  /** Selected day, if the project controls it. Without it, it starts on today. */
  selected?: Date | undefined;
  onSelectDay?: ((day: Date) => void) | undefined;
  /** The panel's heading. Defaults to date-fns' `es`, like `Calendar`. */
  formatDay?: ((day: Date) => string) | undefined;
  formatTime?: ((date: Date) => string) | undefined;
  /** The panel's text when the chosen day has nothing on it. */
  emptyMessage?: ReactNode;
};

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/**
 * `Date` → the value a `datetime-local` expects, in LOCAL time.
 *
 * `toISOString()` does not work and it is the classic bug: it returns UTC, so an
 * event at 00:30 in Santiago gets edited as belonging to the previous day.
 */
function toFieldValue(date: Date): string {
  const two = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${two(date.getMonth() + 1)}-${two(date.getDate())}T${two(
    date.getHours(),
  )}:${two(date.getMinutes())}`;
}

export function EventCalendar({
  events,
  onCreateEvent,
  onUpdateEvent,
  onDeleteEvent,
  selected,
  onSelectDay,
  formatDay = (day) => format(day, "EEEE d 'de' MMMM", { locale: es }),
  formatTime = (date) => format(date, 'HH:mm', { locale: es }),
  emptyMessage = 'Nada en este día.',
  className,
  ...props
}: EventCalendarProps) {
  const id = useId();
  const [diaInterno, setDiaInterno] = useState<Date>(() => selected ?? new Date());
  const day = selected ?? diaInterno;

  // The visible month is tracked separately from the chosen day: paging must not
  // change the selection. With a bare `month={day}`, navigating to October
  // selected the 1st of October and the list beside it changed on its own.
  const [month, setMonth] = useState<Date>(() => day);

  const [editing, setEditing] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [when, setWhen] = useState('');

  const editable = Boolean(onCreateEvent ?? onUpdateEvent);
  const ofTheDay = events
    .filter((e) => sameDay(e.start, day))
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  function pickDay(nuevo: Date | undefined) {
    if (!nuevo) return;
    setDiaInterno(nuevo);
    setMonth(nuevo);
    onSelectDay?.(nuevo);
    cancel();
  }

  function cancel() {
    setEditing(null);
    setTitle('');
    setWhen('');
  }

  function edit(event: CalendarEvent) {
    setEditing(event.id);
    setTitle(event.title);
    setWhen(toFieldValue(event.start));
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim() || !when) return;

    const start = new Date(when);
    if (Number.isNaN(start.getTime())) return;

    if (editing) {
      // It starts from the original event so as not to lose what the form does
      // not edit — `tone` today, whatever gets added tomorrow. If it no longer
      // exists, it is ignored: another tab deleted it while this was open.
      const previous = events.find((ev) => ev.id === editing);
      if (previous) onUpdateEvent?.({ ...previous, title: title.trim(), start });
    } else {
      onCreateEvent?.({ title: title.trim(), start });
    }
    cancel();
  }

  // The days with something on them, for the grid's marker.
  const withEvent = events.map((e) => e.start);

  return (
    <div className={cn('gap-step-lg flex flex-col md:flex-row md:items-start', className)} {...props}>
      <Calendar
        mode="single"
        selected={day}
        onSelect={pickDay}
        month={month}
        onMonthChange={setMonth}
        modifiers={{ withEvent }}
        modifiersClassNames={{
          // The dot goes under the number, not on top of the day's background:
          // over the selected one — which is solid biolume — an accent dot
          // disappears. `after:` in Tailwind v4 already ships `content: ""`, so
          // there is no need to declare it with an arbitrary value.
          withEvent: cn(
            'after:bg-accent after:absolute after:bottom-1 after:left-1/2',
            'after:size-1 after:-translate-x-1/2 after:rounded-pill',
            '[&[data-selected=true]]:after:bg-accent-on',
          ),
        }}
        className="shrink-0"
      />

      <section
        aria-labelledby={`${id}-dia`}
        className="border-hairline rounded-card p-step-md gap-step-md flex min-w-0 flex-1 flex-col border"
      >
        <Text as="h3" variant="h3" id={`${id}-dia`} className="first-letter:uppercase">
          {formatDay(day)}
        </Text>

        {ofTheDay.length > 0 ? (
          <ul className="gap-step-xs flex flex-col">
            {ofTheDay.map((event) => (
              <li
                key={event.id}
                className="border-hairline gap-step-sm py-step-xs flex items-center border-b last:border-b-0"
              >
                <Text
                  as="span"
                  variant="meta"
                  tone={event.tone === 'warm' ? 'warm' : 'accent'}
                  className="shrink-0 tabular-nums"
                >
                  <time dateTime={event.start.toISOString()}>{formatTime(event.start)}</time>
                </Text>

                <Text as="span" variant="ui" className="min-w-0 flex-1 truncate">
                  {event.title}
                </Text>

                {onUpdateEvent ? (
                  <Button
                    variant="tertiary"
                    size="sm"
                    onClick={() => edit(event)}
                    aria-label={`Editar «${event.title}»`}
                  >
                    ./edit
                  </Button>
                ) : null}

                {onDeleteEvent ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="tertiary" size="sm" aria-label={`Borrar «${event.title}»`}>
                        ./borrar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Borrar «{event.title}»</AlertDialogTitle>
                        <AlertDialogDescription>
                          Se borra del {formatDay(event.start)} a las {formatTime(event.start)}. No
                          se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Mejor no</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDeleteEvent(event.id)}>
                          Borrar el event
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          // `EmptyState` is not used: it carries a mascot face, and the mascot
          // has seven counted places where it may appear. An empty day in a
          // schedule is not one of them — and in a thirty-day month, half of them
          // would be.
          <Text as="p" variant="ui" tone="muted">
            {emptyMessage}
          </Text>
        )}

        {editable ? (
          <form onSubmit={submit} className="gap-step-sm border-hairline pt-step-md flex flex-col border-t">
            <div className="gap-step-xs flex flex-col">
              <Label htmlFor={`${id}-title`}>Título</Label>
              <Input
                id={`${id}-title`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Publicar el artículo"
                required
              />
            </div>

            <div className="gap-step-xs flex flex-col">
              <Label htmlFor={`${id}-when`}>Cuándo</Label>
              <DateField
                id={`${id}-when`}
                withTime
                value={when}
                onChange={(e) => setWhen(e.target.value)}
                required
              />
            </div>

            <div className="gap-step-sm flex flex-wrap items-center">
              <Button type="submit" size="sm">
                {editing ? 'Guardar' : 'Añadir'}
              </Button>
              {editing ? (
                <Button type="button" variant="tertiary" size="sm" onClick={cancel}>
                  ./cancelar
                </Button>
              ) : null}
            </div>
          </form>
        ) : null}
      </section>
    </div>
  );
}
