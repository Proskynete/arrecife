import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '../lib/cn.ts';
import { Spinner } from '../lib/glyphs.tsx';

/**
 * Regla de marca 2, como código y no como documentación: en modo claro el botón
 * primario no puede ser bioluz ni arena, así que pasa a casco sólido. No hay un
 * hex literal en ningún lado — `brand.hull` es un token, y el hover reusa
 * `textSecondary` en vez de inventar un `hullHover`.
 *
 * Regla de marca 3: `conversion` va UNA sola vez por pantalla. Está documentado
 * en la story y no se fuerza en runtime: dos botones de conversión en una misma
 * página son un problema de diseño, no un error que deba tirar el render.
 */
const button = cva(
  [
    'inline-flex items-center justify-center gap-xs whitespace-nowrap select-none',
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
          'bg-surface text-text-primary border border-border',
          'hover:bg-surface-raised hover:border-hairline-hover',
        ],
        ghost: 'bg-transparent text-text-secondary hover:bg-surface-raised hover:text-text-primary',
        danger: [
          'bg-transparent text-error border border-error',
          'hover:bg-error hover:text-accent-on',
        ],
      },
      size: {
        sm: 'h-8 px-sm text-label',
        md: 'h-10 px-md text-ui',
        lg: 'h-12 px-lg text-ui',
      },
    },
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
