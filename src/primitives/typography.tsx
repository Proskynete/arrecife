import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ElementType } from 'react';

import { cn } from '../lib/cn.ts';

/**
 * La escala tipográfica como API, no como clases sueltas.
 *
 * Tres reglas del sistema quedan aquí dentro en vez de en la cabeza de quien
 * escribe la vista:
 *
 * 1. La familia va atada a la escala. Display es «solo titulares y números
 *    grandes, nunca cuerpo», así que no hay forma de pedir cuerpo en display:
 *    no existe una prop `font`.
 * 2. El peso, el interlineado y el tracking vienen del token `--text-*`. No se
 *    exponen: cambiarlos por componente es como se deshace una escala.
 * 3. El cuerpo se corta a 68ch solo. `measure` existe para desactivarlo cuando
 *    el texto va dentro de una celda o una tarjeta estrecha, no como preferencia.
 * 4. Hay DOS escalas mono y no una: `eyebrow` lleva versalitas de fábrica y
 *    `meta` no. Casi todo el mono del sistema —fechas, rutas, versiones, la
 *    firma del footer— es `meta`. Un eyebrow con `normal-case` encima es la
 *    señal de que se eligió la escala equivocada.
 *
 * Semántica y estilo son independientes a propósito: `as` elige la etiqueta y
 * `variant` elige la escala. Un `h2` que tiene que verse pequeño es
 * `<Text as="h2" variant="h3">`, no un `h3` que miente sobre la jerarquía.
 */

/** Etiqueta por defecto de cada escala, cuando no se pasa `as`. */
const ETIQUETA = {
  display: 'h1',
  stat: 'p',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  body: 'p',
  lead: 'p',
  ui: 'p',
  label: 'span',
  tag: 'span',
  meta: 'p',
  chip: 'span',
  eyebrow: 'p',
} as const;

const texto = cva('', {
  variants: {
    variant: {
      display: 'text-display font-display',
      // Métricas grandes: 46px de display. Es la única escala pensada para un
      // número, y por eso el interlineado es 1.
      stat: 'text-stat font-display',
      h1: 'text-h1 font-display',
      h2: 'text-h2 font-display',
      h3: 'text-h3 font-display',
      body: 'text-body font-sans',
      // 17px: la bajada de las páginas internas y el botón grande.
      lead: 'text-lead font-sans',
      ui: 'text-ui font-sans',
      label: 'text-label font-sans',
      // Las dos escalas de etiqueta. `tag` es el estado (sans 12.5/500) y `chip`
      // la categoría y la métrica (mono 11.5). Ninguna transforma el texto.
      tag: 'text-tag font-sans',
      chip: 'text-chip font-mono',
      // Mono SIN transformar: fechas, rutas, versiones, nombres de archivo y la
      // firma del footer. Es el escalón que faltaba, y por el que cada sitio de
      // uso terminaba escribiendo `variant="eyebrow" className="normal-case"`.
      meta: 'text-meta font-mono',
      // `uppercase` no cabe en un token de tamaño: text-transform no es un
      // modificador de --text-*. Por eso lo pone la variante y no theme.css.
      eyebrow: 'text-eyebrow font-mono uppercase',
    },
    tone: {
      primary: 'text-text-primary',
      secondary: 'text-text-secondary',
      muted: 'text-text-muted',
      accent: 'text-accent',
      warm: 'text-warm',
      success: 'text-success',
      warning: 'text-warning',
      error: 'text-error',
    },
  },
  defaultVariants: { variant: 'body', tone: 'primary' },
});

/** Etiquetas admitidas. La lista es corta a propósito: no es un `div` con estilo. */
type Etiqueta =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'p'
  | 'span'
  | 'strong'
  | 'em'
  | 'figcaption'
  | 'caption'
  | 'legend'
  | 'dt'
  | 'dd'
  | 'li';

export type TextProps = Omit<ComponentPropsWithoutRef<'p'>, 'color'> &
  VariantProps<typeof texto> & {
    /** Etiqueta HTML. Por defecto, la que corresponde a la escala. */
    as?: Etiqueta;
    /** Renderiza el hijo en vez de crear un elemento, para envolver un enlace. */
    asChild?: boolean;
    /**
     * Corta la línea a 68ch. Activo por defecto en `body`, que es la única
     * escala pensada para leerse en párrafos largos.
     */
    measure?: boolean;
  };

export function Text({
  className,
  variant,
  tone,
  as,
  asChild = false,
  measure,
  children,
  ...props
}: TextProps) {
  const escala = variant ?? 'body';
  const limitar = measure ?? escala === 'body';
  const clases = cn(texto({ variant, tone }), limitar && 'max-w-measure', className);

  if (asChild) {
    return (
      <Slot className={clases} {...props}>
        {children}
      </Slot>
    );
  }

  const Etiqueta = (as ?? ETIQUETA[escala]) as ElementType;

  return (
    <Etiqueta className={clases} {...props}>
      {children}
    </Etiqueta>
  );
}

export { texto as textVariants };
