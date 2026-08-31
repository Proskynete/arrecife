import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '../lib/cn.ts';
import { Spinner } from '../lib/glyphs.tsx';

/**
 * Las CUATRO variantes del sistema, y solo esas cuatro.
 *
 * Regla de marca 2, como código y no como documentación: en modo claro el botón
 * primario no puede ser bioluz ni arena, así que pasa a casco sólido. No hay un
 * hex literal en ningún lado — `brand.hull` es un token, y el hover reusa
 * `textSecondary` en vez de inventar un `hullHover`.
 *
 * Regla de marca 3: `conversion` va UNA sola vez por pantalla. Está documentado
 * en la story y no se fuerza en runtime: dos botones de conversión en una misma
 * página son un problema de diseño, no un error que deba tirar el render.
 *
 * `secondary` NUNCA se rellena el fondo. Es borde y texto: en reposo, hairline
 * de hover y espuma; en hover, los dos pasan a bioluz. Un secundario relleno es
 * un primario mal teñido, y era lo que hacía este archivo.
 *
 * `tertiary` es la estética CLI del sistema: mono, formato `./acción →`, sin
 * caja. Aparece en cada tarjeta, así que no es un `ghost` genérico con otro
 * nombre — el formato del texto es parte de la variante.
 *
 * No hay variante de peligro. El error del sistema vive en los avisos y en la
 * validación de campo, no en un botón rojo. Si alguna vez hace falta uno de
 * verdad, entra primero en el documento y luego aquí.
 */
const button = cva(
  [
    'inline-flex cursor-pointer items-center justify-center gap-step-xs whitespace-nowrap select-none',
    'rounded-control font-sans font-medium',
    'transition-standard',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-accent text-accent-on hover:bg-accent-hover',
          'light:bg-brand-hull light:text-accent-on light:hover:bg-text-secondary',
        ],
        conversion: 'bg-warm text-warm-on hover:bg-warm-hover',
        secondary: [
          'border-hairline-hover border bg-transparent text-text-primary',
          'hover:border-accent hover:text-accent',
        ],
        tertiary: [
          'bg-transparent font-mono font-normal text-text-secondary',
          'hover:text-accent hover:underline hover:underline-offset-4',
        ],
      },
      size: {
        sm: 'h-8 px-control-sm text-label',
        md: 'h-10 px-control-md text-ui',
        lg: 'h-12 px-control-lg text-lead',
        /** Cuadrado 42×42, sin texto. Lleva `aria-label` obligatorio. */
        icon: 'size-control-icon p-0',
      },
    },
    compoundVariants: [
      /**
       * El terciario no tiene caja: ni padding horizontal ni alto de control.
       * Va aquí y no como `px-0` en la variante para que gane al `px-*` del
       * tamaño sin depender del orden en que cva concatena las clases.
       */
      { variant: 'tertiary', size: ['sm', 'md', 'lg'], class: 'h-auto px-0' },
    ],
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export type ButtonProps = ComponentPropsWithoutRef<'button'> &
  VariantProps<typeof button> & {
    /** Renderiza el hijo en vez de un `<button>`, para envolver un enlace. */
    asChild?: boolean;
    /** Deshabilita y anuncia `aria-busy`. Incompatible con `asChild`. */
    loading?: boolean;
    /** Glifo SVG antes del texto. Se oculta mientras carga. */
    icon?: ReactNode;
  };

export function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  icon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  if (asChild) {
    return (
      <Slot className={cn(button({ variant, size }), className)} {...props}>
        {children}
      </Slot>
    );
  }

  return (
    <button
      className={cn(button({ variant, size }), className)}
      disabled={disabled === true || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Spinner /> : icon}
      {children}
    </button>
  );
}

export { button as buttonVariants };
