import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '../lib/cn.ts';

/**
 * El aviso lleva el color en el fondo, no solo en el borde.
 *
 * La receta del sistema es fondo al 8 % del color semántico y borde al 22 %.
 * Este archivo daba `bg-surface` a las cuatro variantes, así que el tono vivía
 * entero en un borde de 1px: cuatro avisos que se distinguían entre sí por una
 * línea.
 *
 * Los cuatro tonos empiezan en ACENTO, que es el informativo del sistema (✦).
 * No hay `neutral`: un aviso sin color es un párrafo.
 *
 * MEDIDO en los dos modos, porque el 8 % del documento está calculado sobre
 * abismo y había que comprobar que sobrevive sobre papel. Contraste del tinte
 * contra el fondo de página:
 *
 *              8 % oscuro   8 % claro
 *   accent       1.149        1.106
 *   success      1.116        1.121
 *   warning      1.126        1.109
 *   error        1.067        1.120
 *
 * El modo claro NO necesita una segunda tabla: aguanta igual o mejor que el
 * oscuro. El único punto flojo del sistema es `error` sobre abismo, 1.067, que
 * es el tinte más tenue de los ocho y se apoya entero en el borde al 22 %.
 *
 * Hay una SEGUNDA receta, a propósito: el aviso bajo el formulario de
 * newsletter va al 10 % con el borde sólido para leerse bajo el campo. Es
 * `enfasis="fuerte"`, y no se unifica con la sutil porque la diferencia está
 * documentada.
 *
 * TERCERA corrección de contraste, en la línea de las tres que ya tenía
 * `tokens.ts`. El título iba en el color semántico, y en modo claro eso no puede
 * pasar AA: los semánticos claros están calibrados para pasar JUSTO sobre papel
 * (4.54–4.88), así que sobre su propio tinte al 8 % caen a 4.11–4.40. No hay
 * alfa que lo arregle — el problema es poner el color encima de sí mismo.
 *
 * El tinte es una SUPERFICIE, así que el texto que lleva encima es un token de
 * texto: `textPrimary` da 14.6–14.9 sobre los cuatro tintes. El color semántico
 * se queda donde no es texto — el borde y el glifo —, que es lo único que el
 * documento pedía de él. El glifo es decorativo y va `aria-hidden`, así que le
 * aplica el umbral de 3:1 y no el de 4.5: su peor caso claro es 4.11.
 *
 * El radio: el documento dice 12, que no es ninguno de los cinco radios del
 * sistema. Usa el de tarjeta antes que estrenar un sexto — ver
 * `docs/decisiones.md`.
 */
const alert = cva('w-full rounded-card border p-step-md font-sans text-ui', {
  variants: {
    variant: {
      accent: 'text-text-secondary',
      success: 'text-text-secondary',
      warning: 'text-text-secondary',
      error: 'text-text-secondary',
    },
    enfasis: {
      sutil: '',
      fuerte: '',
    },
  },
  compoundVariants: [
    { variant: 'accent', enfasis: 'sutil', class: 'border-accent/22 bg-accent/8' },
    { variant: 'success', enfasis: 'sutil', class: 'border-success/22 bg-success/8' },
    { variant: 'warning', enfasis: 'sutil', class: 'border-warning/22 bg-warning/8' },
    { variant: 'error', enfasis: 'sutil', class: 'border-error/22 bg-error/8' },
    { variant: 'accent', enfasis: 'fuerte', class: 'border-accent bg-accent/10' },
    { variant: 'success', enfasis: 'fuerte', class: 'border-success bg-success/10' },
    { variant: 'warning', enfasis: 'fuerte', class: 'border-warning bg-warning/10' },
    { variant: 'error', enfasis: 'fuerte', class: 'border-error bg-error/10' },
  ],
  defaultVariants: { variant: 'accent', enfasis: 'sutil' },
});

/** Solo para el glifo. El título va en `textPrimary`: ver la nota de arriba. */
const glifoColor = {
  accent: 'text-accent',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
} as const;

/**
 * Glifos mono, nunca emoji. Son caracteres y no SVG porque el documento los
 * pide en la familia mono: son parte de la estética CLI, igual que el `❯` de la
 * barra del bloque de código.
 */
const GLIFO = {
  accent: '✦',
  success: '✓',
  warning: '!',
  error: '✕',
} as const;

export type AlertProps = Omit<ComponentPropsWithoutRef<'div'>, 'title'> &
  VariantProps<typeof alert> & {
    title?: ReactNode;
    /**
     * Sustituye el glifo mono de la variante. Nunca un emoji: si necesitas otra
     * cosa, es un SVG de `glyphs`.
     */
    icon?: ReactNode;
  };

export function Alert({
  className,
  variant,
  enfasis,
  title,
  icon,
  children,
  ...props
}: AlertProps) {
  const tono = variant ?? 'accent';

  return (
    <div
      role={tono === 'error' ? 'alert' : 'status'}
      className={cn(alert({ variant, enfasis }), className)}
      {...props}
    >
      <div className="gap-step-sm flex items-start">
        <span
          aria-hidden="true"
          className={cn('font-mono text-ui leading-normal select-none', glifoColor[tono])}
        >
          {icon ?? GLIFO[tono]}
        </span>

        <div className="min-w-0 flex-1">
          {title ? (
            <p className="mb-step-xs text-text-primary font-medium">{title}</p>
          ) : null}
          {children ? <div className="max-w-measure">{children}</div> : null}
        </div>
      </div>
    </div>
  );
}

export { alert as alertVariants };
