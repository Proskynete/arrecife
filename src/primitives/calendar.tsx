import { es } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import type { ComponentProps } from 'react';

import { cn } from '../lib/cn.ts';
import { ChevronLeft, ChevronRight } from '../lib/glyphs.tsx';

export type CalendarProps = ComponentProps<typeof DayPicker> & {
  /**
   * Estira el calendario hasta ocupar todo el ancho de su contenedor, con las
   * celdas repartiéndoselo a partes iguales.
   *
   * Apagado, el calendario mide lo que miden sus celdas —36 px cada una— y es lo
   * que quieres dentro de un `Popover`, donde estirarlo dejaría un globo enorme.
   * Encendido, es la vista de mes de un planificador, que ocupa la página.
   *
   * Con varios meses, cada uno se lleva una fracción igual del ancho.
   */
  fullWidth?: boolean | undefined;
};

/**
 * Calendario mensual navegable, sobre `react-day-picker`.
 *
 * Es la única dependencia pesada de la librería y entró a sabiendas: el
 * calendario del planificador de contenido no se puede resolver con el control
 * nativo. Para elegir una fecha dentro de un formulario existe `DateField`, que
 * no arrastra nada.
 *
 * `animate` se queda apagado —es su valor por defecto— así que el cambio de mes
 * no se desliza. Los días se marcan con color y borde, como todo lo demás.
 *
 * El idioma va en español por defecto porque los cinco proyectos lo están; se
 * cambia pasando otro `locale` de date-fns.
 *
 * No trae el `style.css` de la librería: todas las clases salen de aquí, así que
 * el consumidor no tiene que importar CSS de terceros ni pelearse con su
 * especificidad.
 */
export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  fullWidth = false,
  ...props
}: CalendarProps) {
  const dia = [
    'relative p-0 text-center',
    fullWidth ? 'h-9 flex-1' : 'size-9',
    'text-ui font-sans text-text-primary',
  ].join(' ');

  const botonDia = [
    fullWidth ? 'h-9 w-full' : 'size-9',
    'rounded-chip inline-flex items-center justify-center',
    'transition-standard cursor-pointer',
    'hover:bg-surface-raised',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
    'disabled:pointer-events-none disabled:opacity-50',
  ].join(' ');

  const navegacion = [
    'size-8 rounded-chip inline-flex items-center justify-center',
    'text-text-secondary transition-standard cursor-pointer',
    'hover:bg-surface-raised hover:text-text-primary',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
    'disabled:pointer-events-none disabled:opacity-50',
  ].join(' ');

  return (
    <DayPicker
      locale={es}
      showOutsideDays={showOutsideDays}
      className={cn('font-sans', className)}
      classNames={{
        // `relative` obligatorio: la navegación se posiciona en absoluto contra
        // la raíz, y sin esto se ancla al primer ancestro posicionado —o al
        // viewport— y las flechas acaban en los bordes de la página.
        root: cn('relative', fullWidth ? 'w-full' : 'w-fit'),
        months: cn('gap-step-md flex flex-col sm:flex-row', fullWidth && 'w-full'),
        month: cn('gap-step-sm flex flex-col', fullWidth && 'min-w-0 flex-1'),
        month_caption: 'h-8 flex items-center justify-center',
        caption_label: 'text-ui font-sans font-medium text-text-primary capitalize',
        nav: 'absolute inset-x-0 top-0 flex items-center justify-between',
        button_previous: navegacion,
        button_next: navegacion,
        month_grid: 'w-full border-collapse',
        weekdays: cn('flex', fullWidth && 'w-full'),
        // `textMuted` no va sobre `surfaceRaised` —4.07:1—, y un calendario dentro de
        // un Popover vive justo ahí.
        weekday: cn(
          'h-9 text-eyebrow font-mono text-text-secondary uppercase flex items-center justify-center',
          fullWidth ? 'flex-1' : 'w-9',
        ),
        week: 'flex w-full',
        day: dia,
        day_button: botonDia,
        today: 'text-accent font-medium',
        // Los días de los meses vecinos se atenúan, pero no por debajo de AA:
        // `textSecondary` al 85 % da 5.09:1 en el peor caso, que es sobre
        // `surfaceRaised`. Al 75 % ya no pasa en modo claro.
        outside: 'text-text-secondary opacity-85',
        disabled: 'opacity-50',
        hidden: 'invisible',
        selected: '[&_button]:bg-accent [&_button]:text-accent-on [&_button]:hover:bg-accent-hover',
        range_start: '[&_button]:bg-accent [&_button]:text-accent-on [&_button]:rounded-r-none',
        range_middle: '[&_button]:bg-surface-raised [&_button]:text-text-primary [&_button]:rounded-none',
        range_end: '[&_button]:bg-accent [&_button]:text-accent-on [&_button]:rounded-l-none',
        footer: 'text-label font-sans text-text-secondary pt-step-sm',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...rest }) =>
          orientation === 'left' ? <ChevronLeft {...rest} /> : <ChevronRight {...rest} />,
      }}
      {...props}
    />
  );
}
