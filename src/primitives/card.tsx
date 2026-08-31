import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';
import { Text } from './typography.tsx';

/**
 * El contenedor de superficie del sistema, y la única definición de lo que es
 * una tarjeta: `surface`, borde `hairline`, radio de tarjeta.
 *
 * Las tarjetas con dominio — `ArticleCard`, `TalkCard`, `CourseCard`,
 * `LinkRow` — reutilizan estas mismas clases, así que si el radio o el borde
 * cambian, cambian en todas a la vez.
 *
 * El documento daba a la tarjeta un fondo propio, `#0B1620`, un cuarto nivel de
 * superficie entre abismo y fosa. No entra: no tiene par en modo claro, y una
 * superficie sin par es un token que miente en la mitad de los proyectos. La
 * tarjeta es `surface`, y el documento se corrige — ver `docs/decisiones.md`.
 *
 * El padding sí estaba mal: el documento pide 26 (`lg`) y aquí había 16 (`md`).
 */
export const SUPERFICIE_TARJETA = 'rounded-card border-hairline bg-surface border';

/** El hover de la regla 6: solo el borde. Se aplica donde la tarjeta es pulsable. */
export const HOVER_TARJETA = 'transition-standard hover:border-hairline-hover';

export function Card({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn(SUPERFICIE_TARJETA, className)} {...props} />;
}

export function CardHeader({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('gap-step-xs p-step-lg flex flex-col', className)} {...props} />;
}

export function CardTitle({ className, ...props }: ComponentPropsWithoutRef<'h3'>) {
  return <Text as="h3" variant="h3" className={className} {...props} />;
}

export function CardDescription({ className, ...props }: ComponentPropsWithoutRef<'p'>) {
  return <Text variant="ui" tone="secondary" className={className} {...props} />;
}

export function CardContent({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('px-step-lg pb-step-lg', className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn('border-hairline px-step-lg py-step-md gap-step-sm flex items-center border-t', className)}
      {...props}
    />
  );
}
