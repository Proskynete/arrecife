import * as AccordionPrimitive from '@radix-ui/react-accordion';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';
import { ChevronDown } from '../lib/glyphs.tsx';

/**
 * El plegable. Lo pedían dos proyectos: el FAQ del portafolio y el temario de
 * cursos, que es literalmente una lista de secciones que se abren.
 *
 * La altura SÍ se anima, y es la cuarta excepción declarada del sistema.
 *
 * Merece explicarse, porque la regla general es la contraria y este componente
 * nació sin animar citándola. La diferencia es que aquí no APARECE nada: se
 * abre un hueco, y todo lo que hay debajo del acordeón se desplaza. Sin
 * transición ese desplazamiento es un salto, y quien acaba de pulsar pierde el
 * sitio en la página — que es justo el daño que la regla «nada de movimiento»
 * existe para evitar. Es la misma categoría que el panel lateral, la segunda
 * excepción, y no la de una animación de entrada.
 *
 * Va detrás de `motion-safe`, dura `--duration-standard` y usa
 * `--ease-standard`, así que no estrena un tiempo ni una curva. Quien pidió
 * menos movimiento sigue viendo el panel aparecer donde va a quedarse.
 *
 * Ver `docs/decisiones.md` § 20.
 *
 * El galón, en cambio, gira sin transición: `transition-standard` solo cubre
 * color y borde, así que `rotate` salta aunque la clase esté puesta. Es el mismo
 * trato que recibe el ancho de `Progress`.
 *
 * La división entre items es `hairline`, no `border`: es una separación de
 * lectura, no el borde de un control.
 */
export type AccordionProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>;

export function Accordion({ className, ...props }: AccordionProps) {
  return (
    <AccordionPrimitive.Root
      className={cn('border-hairline w-full border-t', className)}
      {...props}
    />
  );
}

export function AccordionItem({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item className={cn('border-hairline border-b', className)} {...props} />;
}

/**
 * El disparador es el encabezado, así que va DENTRO de un `<h3>`: Radix envuelve
 * el botón en `AccordionPrimitive.Header`, que renderiza el elemento que se le
 * pida. Sin eso, un lector de pantalla ve una lista de botones sueltos y pierde
 * la estructura de la página, que es justo lo que un FAQ necesita conservar.
 *
 * `headingLevel` existe porque el nivel correcto depende de dónde se monte: en
 * una página de FAQ el bloque cuelga de un `<h2>` de sección, y en un temario
 * puede colgar de un `<h3>`. Fijarlo aquí sería adivinar.
 */
export type AccordionTriggerProps = ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Trigger
> & {
  /** Nivel del encabezado que envuelve al disparador. */
  headingLevel?: 2 | 3 | 4;
};

export function AccordionTrigger({
  className,
  children,
  headingLevel = 3,
  ...props
}: AccordionTriggerProps) {
  const Encabezado = `h${headingLevel}` as const;

  return (
    <AccordionPrimitive.Header asChild>
      <Encabezado>
        <AccordionPrimitive.Trigger
          className={cn(
            'gap-step-sm py-step-sm flex w-full cursor-pointer items-center justify-between text-left',
            'font-sans text-lead font-medium text-text-primary',
            'transition-standard',
            'hover:text-accent',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
            'disabled:pointer-events-none disabled:opacity-50',
            '[&[data-state=open]>svg]:rotate-180',
            className,
          )}
          {...props}
        >
          {children}
          <ChevronDown className="text-text-muted shrink-0" />
        </AccordionPrimitive.Trigger>
      </Encabezado>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className={cn(
        'overflow-hidden',
        'motion-safe:data-[state=open]:desplegar motion-safe:data-[state=closed]:replegar',
      )}
      {...props}
    >
      <div className={cn('pb-step-md font-sans text-ui text-text-secondary max-w-measure', className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}
