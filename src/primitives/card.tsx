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
 */
export const SUPERFICIE_TARJETA = 'rounded-card border-hairline bg-surface border';

/** El hover de la regla 6: solo el borde. Se aplica donde la tarjeta es pulsable. */
export const HOVER_TARJETA = 'transition-standard hover:border-hairline-hover';

export function Card({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn(SUPERFICIE_TARJETA, className)} {...props} />;
}

export function CardHeader({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('gap-xs p-md flex flex-col', className)} {...props} />;
}

export function CardTitle({ className, ...props }: ComponentPropsWithoutRef<'h3'>) {
  return <Text as="h3" variant="h3" className={className} {...props} />;
}

export function CardDescription({ className, ...props }: ComponentPropsWithoutRef<'p'>) {
  return <Text variant="ui" tone="secondary" className={className} {...props} />;
}

export function CardContent({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('px-md pb-md', className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn('border-hairline px-md py-sm gap-sm flex items-center border-t', className)}
      {...props}
    />
  );
}
