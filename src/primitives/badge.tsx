import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';

/**
 * TRES familias de etiqueta, no una.
 *
 * El sistema define tres formas distintas y este archivo las servía todas como
 * píldora mono en versalitas. Cada una tiene su forma porque cada una dice otra
 * cosa:
 *
 *   categoría · píldora r999, mono 11.5, arena   → un slug: `engineering-culture`
 *   estado    · cuadrada r6, sans 12.5/500, tinte → un semáforo: publicado, borrador
 *   métrica   · píldora, mono 11.5 muted          → un dato: `8 min de lectura`
 *
 * NINGUNA va en versalitas. El `uppercase tracking-[0.12em]` que tenían las tres
 * venía de `text-eyebrow`, que es la escala del eyebrow y no la de las
 * etiquetas: convertía `engineering-culture` en `ENGINEERING-CULTURE` y
 * `pose-laptop-coffee.png` en un nombre de archivo que no existe.
 */

/* ------------------------------------------------------------------ estado */

/**
 * Semáforo. Cuadrada r6, sans 12.5/500 y fondo al 8 % del semántico — la receta
 * del aviso en tamaño de palabra: un estado es un aviso de una sola palabra.
 *
 * SIN borde. Lo llevó un tiempo, puesto para reforzar el tono, y pesaba: una
 * caja con borde al lado de un título se lee como un control y no como un dato.
 * El tinte solo es lo que pide el documento y es lo que se ve más limpio.
 *
 * El texto va en `textPrimary`, no en el color del tono. En modo claro los
 * semánticos están calibrados para pasar JUSTO sobre papel, así que sobre su
 * propio tinte caen a 4.10–4.40 y no pasan AA. El tinte es una superficie;
 * encima va un token de texto. Medido en `alert.tsx`.
 *
 * El tono nunca es el único portador del significado: la etiqueta dice
 * «Publicado» o «Borrador» con todas sus letras.
 */
const badge = cva(
  ['inline-flex items-center gap-step-xs', 'rounded-chip px-step-xs py-0.5', 'font-sans text-tag', 'transition-standard'],
  {
    variants: {
      variant: {
        neutral: 'bg-surface-raised text-text-secondary',
        accent: 'bg-accent/8 text-text-primary',
        warm: 'bg-warm/8 text-text-primary',
        success: 'bg-success/8 text-text-primary',
        warning: 'bg-warning/8 text-text-primary',
        error: 'bg-error/8 text-text-primary',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
);

export type BadgeProps = ComponentPropsWithoutRef<'span'> & VariantProps<typeof badge>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badge({ variant }), className)} {...props} />;
}

/* --------------------------------------------------------------- categoría */

/**
 * Un slug, en arena. Sin transformar: los slugs ya vienen en minúscula y
 * forzarla sería el mismo error que forzaba el `uppercase`.
 *
 * El borde del documento es `#4A3A25`, que es arena al 28 % sobre abismo: sale
 * de la paleta, así que no entra como token nuevo. En modo claro la misma regla
 * da arena oscura al 28 % sobre papel, que es lo que se quiere.
 *
 * La variante rellena NO es decorativa: es el único indicador de filtro activo
 * del listado de artículos. Por eso `active` es una prop y no un `className`.
 */
const categoria = cva(
  [
    'inline-flex items-center gap-step-xs',
    'rounded-pill px-step-sm py-0.5',
    'font-mono text-chip',
    'border transition-standard',
  ],
  {
    variants: {
      active: {
        false: 'border-warm/28 bg-transparent text-warm',
        true: 'border-warm bg-warm text-warm-on',
      },
    },
    defaultVariants: { active: false },
  },
);

export type CategoryBadgeProps = ComponentPropsWithoutRef<'span'> & {
  /** Filtro seleccionado: arena sólido con tinta encima. */
  active?: boolean | undefined;
};

export function CategoryBadge({ className, active = false, ...props }: CategoryBadgeProps) {
  return (
    <span
      data-active={active || undefined}
      className={cn(categoria({ active }), className)}
      {...props}
    />
  );
}

/* ----------------------------------------------------------------- métrica */

/**
 * Un dato: minutos de lectura, número de módulos, nombre de archivo.
 *
 * Sin caja de color y sin transformar. Es la familia que estaba pidiendo
 * `marca.stories.tsx` cuando renderizaba `LAPTOP-COFFEE` sobre un nombre de
 * archivo que en realidad es `pose-laptop-coffee.png`.
 */
const metrica = ['inline-flex items-center gap-step-xs', 'rounded-pill', 'font-mono text-chip text-text-muted'];

export type MetricBadgeProps = ComponentPropsWithoutRef<'span'> & {
  /** Añade el aro de hairline. Por defecto la métrica va sin caja. */
  boxed?: boolean | undefined;
};

export function MetricBadge({ className, boxed = false, ...props }: MetricBadgeProps) {
  return (
    <span
      className={cn(metrica, boxed && 'border-hairline px-step-sm py-0.5 border', className)}
      {...props}
    />
  );
}

export {
  badge as badgeVariants,
  categoria as categoryBadgeVariants,
};
