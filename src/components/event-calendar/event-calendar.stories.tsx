import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Nota } from '../../../stories/utils.tsx';
import { EventCalendar, type EventoCalendario } from './index.tsx';

const meta = {
  title: 'Componentes/EventCalendar',
  component: EventCalendar,
  args: { events: [] },
} satisfies Meta<typeof EventCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Fijos, no `new Date()`: una story que cambia de mes no es reproducible. */
const HOY = new Date(2026, 8, 15, 9, 0);

const EVENTOS: readonly EventoCalendario[] = [
  { id: '1', start: new Date(2026, 8, 15, 10, 0), title: 'Publicar «Escalar con criterio»' },
  { id: '2', start: new Date(2026, 8, 15, 16, 30), title: 'Revisar el borrador de la newsletter' },
  { id: '3', start: new Date(2026, 8, 18, 12, 0), title: 'Charla en JSConf', tone: 'warm' },
  { id: '4', start: new Date(2026, 8, 24, 9, 0), title: 'Cierre del curso' },
];

function Agenda({ soloLectura = false }: { soloLectura?: boolean }) {
  const [eventos, setEventos] = useState<readonly EventoCalendario[]>(EVENTOS);

  if (soloLectura) {
    return <EventCalendar events={eventos} selected={HOY} />;
  }

  return (
    <EventCalendar
      events={eventos}
      selected={HOY}
      onCreateEvent={(evento) => {
        // El id sale del máximo que ya hay, dentro del actualizador. Un contador
        // en una variable de la función se reasignaría después del render y
        // volvería a empezar en cuanto algo remonte: dos eventos con el mismo id.
        setEventos((previos) => {
          const id = Math.max(0, ...previos.map((e) => Number(e.id) || 0)) + 1;
          return [...previos, { ...evento, id: String(id) }];
        });
      }}
      onUpdateEvent={(evento) =>
        setEventos((previos) => previos.map((e) => (e.id === evento.id ? evento : e)))
      }
      onDeleteEvent={(id) => setEventos((previos) => previos.filter((e) => e.id !== id))}
    />
  );
}

export const Basico: Story = {
  name: 'Básico',
  render: () => (
    <div>
      <Agenda />
      <Nota>
        Dos columnas, no un popover sobre el día. El popover es lo que hace todo
        el mundo y esconde el contenido detrás de un clic; con la lista al lado,
        un mes con quince eventos se lee de un vistazo.
      </Nota>
      <Nota>
        Los días con algo llevan un punto bajo el número. Sobre el día
        seleccionado el punto pasa a `accentOn`, porque un punto de acento sobre
        un fondo de acento sólido no existe.
      </Nota>
      <Nota>
        El componente no guarda nada ni inventa ids: emite `onCreateEvent`,
        `onUpdateEvent` y `onDeleteEvent`, y el id lo pone quien persiste.
      </Nota>
    </div>
  ),
};

export const SoloLectura: Story = {
  name: 'Solo lectura',
  render: () => (
    <div>
      <Agenda soloLectura />
      <Nota>
        Sin `onCreateEvent` ni `onUpdateEvent` no se pinta el formulario, y sin
        `onDeleteEvent` no aparece el botón de borrar. La agenda de solo lectura
        no es una prop: es no pasar los manejadores.
      </Nota>
    </div>
  ),
};

export const Borrado: Story = {
  name: 'El borrado pide confirmación',
  render: () => (
    <div>
      <Agenda />
      <Nota>
        `./borrar` abre un `AlertDialog`, no borra directo. Es exactamente el caso
        para el que existe esa primitiva: destructivo y sin deshacer. El foco
        entra en «Mejor no».
      </Nota>
    </div>
  ),
};
