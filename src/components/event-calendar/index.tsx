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
 * El calendario con eventos: verlos, crearlos, editarlos y borrarlos.
 *
 * `Calendar` es la primitiva y sigue siendo una rejilla de fechas: sirve para
 * ELEGIR un día y no sabe nada de contenido. Esto es la agenda, y por eso vive
 * en `components/` y no al lado de aquella — tiene estado, tiene formulario y
 * codifica cómo se ve un día con cosas dentro.
 *
 * Es presentacional, como el resto de la librería: recibe `events` y emite
 * `onCreateEvent`, `onUpdateEvent` y `onDeleteEvent`. No guarda nada, no llama a
 * ninguna API y no genera ids — el id lo pone quien persiste, porque es quien
 * sabe si viene de una base de datos o de un fichero.
 *
 * DOS COLUMNAS y no un popover sobre el día. El popover es lo que hace todo el
 * mundo y esconde el contenido detrás de un clic: con la lista al lado, un mes
 * con quince eventos se lee de un vistazo y el día seleccionado no tapa la
 * rejilla. En pantalla estrecha se apilan.
 *
 * El borrado pasa por `AlertDialog` y no por un botón directo. Es exactamente el
 * caso para el que existe: una acción destructiva sin deshacer.
 */
export type EventoCalendario = {
  /** Lo pone el proyecto. La librería nunca lo inventa. */
  id: string;
  /** Cuándo empieza, con hora. */
  start: Date;
  title: string;
  /** `warm` cuando el evento es el problema, igual que en `Stat`. */
  tone?: 'accent' | 'warm' | undefined;
};

export type EventCalendarProps = Omit<ComponentPropsWithoutRef<'div'>, 'onSelect' | 'children'> & {
  events: readonly EventoCalendario[];
  /** Sin él, la agenda es de solo lectura y no se pinta el formulario. */
  onCreateEvent?: ((evento: Omit<EventoCalendario, 'id'>) => void) | undefined;
  onUpdateEvent?: ((evento: EventoCalendario) => void) | undefined;
  onDeleteEvent?: ((id: string) => void) | undefined;
  /** Día seleccionado, si el proyecto lo controla. Sin él, empieza en hoy. */
  selected?: Date | undefined;
  onSelectDay?: ((dia: Date) => void) | undefined;
  /** Encabezado del panel. Por defecto, `es` de date-fns, como `Calendar`. */
  formatDay?: ((dia: Date) => string) | undefined;
  formatTime?: ((fecha: Date) => string) | undefined;
  /** Texto del panel cuando el día elegido no tiene nada. */
  emptyMessage?: ReactNode;
};

const mismoDia = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/**
 * `Date` → el valor que espera un `datetime-local`, en hora LOCAL.
 *
 * `toISOString()` no sirve y es el error clásico: devuelve UTC, así que un
 * evento de las 00:30 en Santiago se edita como del día anterior.
 */
function aValorDeCampo(fecha: Date): string {
  const dos = (n: number) => String(n).padStart(2, '0');
  return `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())}T${dos(
    fecha.getHours(),
  )}:${dos(fecha.getMinutes())}`;
}

export function EventCalendar({
  events,
  onCreateEvent,
  onUpdateEvent,
  onDeleteEvent,
  selected,
  onSelectDay,
  formatDay = (dia) => format(dia, "EEEE d 'de' MMMM", { locale: es }),
  formatTime = (fecha) => format(fecha, 'HH:mm', { locale: es }),
  emptyMessage = 'Nada en este día.',
  className,
  ...props
}: EventCalendarProps) {
  const id = useId();
  const [diaInterno, setDiaInterno] = useState<Date>(() => selected ?? new Date());
  const dia = selected ?? diaInterno;

  // El mes visible va aparte del día elegido: pasar de página no debe cambiar la
  // selección. Con `month={dia}` a secas, navegar a octubre seleccionaba el 1 de
  // octubre y la lista de al lado cambiaba sola.
  const [mes, setMes] = useState<Date>(() => dia);

  const [editando, setEditando] = useState<string | null>(null);
  const [titulo, setTitulo] = useState('');
  const [cuando, setCuando] = useState('');

  const editable = Boolean(onCreateEvent ?? onUpdateEvent);
  const delDia = events
    .filter((e) => mismoDia(e.start, dia))
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  function elegirDia(nuevo: Date | undefined) {
    if (!nuevo) return;
    setDiaInterno(nuevo);
    setMes(nuevo);
    onSelectDay?.(nuevo);
    cancelar();
  }

  function cancelar() {
    setEditando(null);
    setTitulo('');
    setCuando('');
  }

  function editar(evento: EventoCalendario) {
    setEditando(evento.id);
    setTitulo(evento.title);
    setCuando(aValorDeCampo(evento.start));
  }

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!titulo.trim() || !cuando) return;

    const start = new Date(cuando);
    if (Number.isNaN(start.getTime())) return;

    if (editando) {
      // Se parte del evento original para no perder lo que el formulario no
      // edita —hoy `tone`, mañana lo que se añada—. Si ya no existe, se ignora:
      // otra pestaña lo borró mientras esto estaba abierto.
      const previo = events.find((ev) => ev.id === editando);
      if (previo) onUpdateEvent?.({ ...previo, title: titulo.trim(), start });
    } else {
      onCreateEvent?.({ title: titulo.trim(), start });
    }
    cancelar();
  }

  // Los días con algo, para la marca de la rejilla.
  const conEvento = events.map((e) => e.start);

  return (
    <div className={cn('gap-step-lg flex flex-col md:flex-row md:items-start', className)} {...props}>
      <Calendar
        mode="single"
        selected={dia}
        onSelect={elegirDia}
        month={mes}
        onMonthChange={setMes}
        modifiers={{ conEvento }}
        modifiersClassNames={{
          // El punto va bajo el número, no encima del fondo del día: sobre el
          // seleccionado —que es bioluz sólido— un punto de acento desaparece.
          // `after:` en Tailwind v4 ya trae `content: ""`, así que no hace falta
          // declararlo con un valor arbitrario.
          conEvento: cn(
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
          {formatDay(dia)}
        </Text>

        {delDia.length > 0 ? (
          <ul className="gap-step-xs flex flex-col">
            {delDia.map((evento) => (
              <li
                key={evento.id}
                className="border-hairline gap-step-sm py-step-xs flex items-center border-b last:border-b-0"
              >
                <Text
                  as="span"
                  variant="meta"
                  tone={evento.tone === 'warm' ? 'warm' : 'accent'}
                  className="shrink-0 tabular-nums"
                >
                  <time dateTime={evento.start.toISOString()}>{formatTime(evento.start)}</time>
                </Text>

                <Text as="span" variant="ui" className="min-w-0 flex-1 truncate">
                  {evento.title}
                </Text>

                {onUpdateEvent ? (
                  <Button
                    variant="tertiary"
                    size="sm"
                    onClick={() => editar(evento)}
                    aria-label={`Editar «${evento.title}»`}
                  >
                    ./editar
                  </Button>
                ) : null}

                {onDeleteEvent ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="tertiary" size="sm" aria-label={`Borrar «${evento.title}»`}>
                        ./borrar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Borrar «{evento.title}»</AlertDialogTitle>
                        <AlertDialogDescription>
                          Se borra del {formatDay(evento.start)} a las {formatTime(evento.start)}. No
                          se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Mejor no</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDeleteEvent(evento.id)}>
                          Borrar el evento
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          // `EmptyState` no: lleva una cara de la mascota, y la mascota tiene
          // siete sitios contados donde puede aparecer. Un día vacío de una
          // agenda no es uno de ellos — y en un mes de treinta días, la mitad lo
          // serían.
          <Text as="p" variant="ui" tone="muted">
            {emptyMessage}
          </Text>
        )}

        {editable ? (
          <form onSubmit={enviar} className="gap-step-sm border-hairline pt-step-md flex flex-col border-t">
            <div className="gap-step-xs flex flex-col">
              <Label htmlFor={`${id}-titulo`}>Título</Label>
              <Input
                id={`${id}-titulo`}
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Publicar el artículo"
                required
              />
            </div>

            <div className="gap-step-xs flex flex-col">
              <Label htmlFor={`${id}-cuando`}>Cuándo</Label>
              <DateField
                id={`${id}-cuando`}
                withTime
                value={cuando}
                onChange={(e) => setCuando(e.target.value)}
                required
              />
            </div>

            <div className="gap-step-sm flex flex-wrap items-center">
              <Button type="submit" size="sm">
                {editando ? 'Guardar' : 'Añadir'}
              </Button>
              {editando ? (
                <Button type="button" variant="tertiary" size="sm" onClick={cancelar}>
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
