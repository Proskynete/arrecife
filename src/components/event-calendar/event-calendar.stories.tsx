import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Note } from '../../../stories/utils.tsx';
import { EventCalendar, type CalendarEvent } from './index.tsx';

const meta = {
  title: 'Components/EventCalendar',
  component: EventCalendar,
  args: { events: [] },
} satisfies Meta<typeof EventCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Fijos, no `new Date()`: una story que cambia de month no es reproducible. */
const TODAY = new Date(2026, 8, 15, 9, 0);

const EVENTS: readonly CalendarEvent[] = [
  { id: '1', start: new Date(2026, 8, 15, 10, 0), title: 'Publicar «Escalar con criterio»' },
  { id: '2', start: new Date(2026, 8, 15, 16, 30), title: 'Revisar el borrador de la newsletter' },
  { id: '3', start: new Date(2026, 8, 18, 12, 0), title: 'Charla en JSConf', tone: 'warm' },
  { id: '4', start: new Date(2026, 8, 24, 9, 0), title: 'Cierre del curso' },
];

function Schedule({ soloLectura = false }: { soloLectura?: boolean }) {
  const [events, setEventos] = useState<readonly CalendarEvent[]>(EVENTS);

  if (soloLectura) {
    return <EventCalendar events={events} selected={TODAY} />;
  }

  return (
    <EventCalendar
      events={events}
      selected={TODAY}
      onCreateEvent={(event) => {
        // El id sale del máximo que ya hay, dentro del actualizador. Un counter
        // en una variable de la función se reasignaría después del render y
        // volvería a empezar en cuanto algo remonte: two events con el mismo id.
        setEventos((previos) => {
          const id = Math.max(0, ...previos.map((e) => Number(e.id) || 0)) + 1;
          return [...previos, { ...event, id: String(id) }];
        });
      }}
      onUpdateEvent={(event) =>
        setEventos((previos) => previos.map((e) => (e.id === event.id ? event : e)))
      }
      onDeleteEvent={(id) => setEventos((previos) => previos.filter((e) => e.id !== id))}
    />
  );
}

export const Basic: Story = {
  name: 'Basic',
  render: () => (
    <div>
      <Schedule />
      <Note>
        Two columns, not a popover over the day. The popover is what everyone does
        and it hides the content behind a click; with the list beside it, a month
        with fifteen events reads at a glance.
      </Note>
      <Note>
        Days with something on them carry a dot under the number. Over the selected
        day the dot switches to `accentOn`, because an accent dot on a solid accent
        background does not exist.
      </Note>
      <Note>
        The component stores nothing and invents no ids: it emits `onCreateEvent`,
        `onUpdateEvent` and `onDeleteEvent`, and the id is set by whoever persists.
      </Note>
    </div>
  ),
};

export const ReadOnly: Story = {
  name: 'Read only',
  render: () => (
    <div>
      <Schedule soloLectura />
      <Note>
        With no `onCreateEvent` or `onUpdateEvent` the form is not painted, and
        with no `onDeleteEvent` the delete button does not appear. A read-only
        schedule is not a prop: it is not passing the handlers.
      </Note>
    </div>
  ),
};

export const Deleted: Story = {
  name: 'Deleting asks for confirmation',
  render: () => (
    <div>
      <Schedule />
      <Note>
        `./borrar` opens an `AlertDialog`, it does not delete directly. It is
        precisely the case that primitive exists for: destructive and with no undo.
        Focus lands on «Mejor no».
      </Note>
    </div>
  ),
};
