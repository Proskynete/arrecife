import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';

export type DateFieldProps = Omit<ComponentPropsWithoutRef<'input'>, 'type'> & {
  invalid?: boolean | undefined;
  /** Añade la hora al campo. Es el `datetime-local` nativo. */
  withTime?: boolean | undefined;
};

/**
 * Un campo de fecha sobre el control nativo, no sobre un calendario propio.
 *
 * Es una decisión deliberada: `react-day-picker` habría sido la primera
 * dependencia pesada de la librería, con su propio CSS y su propia animación de
 * cambio de mes — que el sistema no permite. El control nativo trae gratis el
 * teclado del sistema operativo, el formato según el idioma del usuario y el
 * soporte de lector de pantalla, que es más de lo que un calendario a medida da
 * sin trabajo.
 *
 * Cubre elegir una fecha dentro de un formulario. Un calendario mensual
 * navegable es otra cosa y vive en el proyecto que lo necesita.
 *
 * El icono nativo del selector se tiñe con `color-scheme`, que es lo único que
 * el navegador deja controlar: se ata al modo activo para que no aparezca un
 * cuadradito blanco sobre fondo abismo.
 */
export function DateField({
  className,
  invalid = false,
  withTime = false,
  ...props
}: DateFieldProps) {
  return (
    <input
      type={withTime ? 'datetime-local' : 'date'}
      data-invalid={invalid || undefined}
      aria-invalid={invalid || undefined}
      className={cn(
        'px-step-sm h-10 w-full',
        'rounded-control border-border bg-surface border',
        'font-mono text-ui text-text-primary',
        'transition-standard',
        'hover:border-hairline-hover',
        'focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        'disabled:pointer-events-none disabled:opacity-50',
        'data-[invalid]:border-error data-[invalid]:focus-visible:outline-error',
        // El indicador nativo hereda el esquema del tema activo.
        'scheme-light dark:scheme-dark [&::-webkit-calendar-picker-indicator]:cursor-pointer',
        className,
      )}
      {...props}
    />
  );
}
