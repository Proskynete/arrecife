import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '../../lib/cn.ts';
import { SUPERFICIE_TARJETA } from '../../primitives/card.tsx';
import { Progress } from '../../primitives/progress.tsx';
import { Text } from '../../primitives/typography.tsx';

/**
 * Una métrica grande: el número en la escala `stat` y su nombre debajo.
 *
 * La regla del documento no es de estilo, es de semántica: «bioluz para lo
 * neutro y arena SOLO cuando el número es el problema». Un 12 de aplicaciones
 * es un dato; un 0 de design systems es el problema del que trata la charla.
 * Por eso `tone` no es una paleta abierta — son dos valores y significan cosas
 * distintas.
 */
export type StatProps = Omit<ComponentPropsWithoutRef<'div'>, 'title'> & {
  /** El número, ya formateado. La librería no impone locale. */
  value: ReactNode;
  /** Qué se está contando. Va en mono versalitas. */
  label: ReactNode;
  /** `alerta` solo cuando el número ES el problema. */
  tone?: 'neutral' | 'alerta';
  /** Con `progress`, la métrica se lee como avance y añade la barra. */
  progress?: number | undefined;
};

export function Stat({ value, label, tone = 'neutral', progress, className, ...props }: StatProps) {
  return (
    <div className={cn(SUPERFICIE_TARJETA, 'p-lg gap-xs flex flex-col', className)} {...props}>
      <Text variant="stat" as="p" tone={tone === 'alerta' ? 'warm' : 'accent'}>
        {value}
      </Text>

      <Text variant="eyebrow" tone="muted" as="p">
        {label}
      </Text>

      {typeof progress === 'number' ? (
        <Progress
          value={progress}
          tone={tone === 'alerta' ? 'warm' : 'accent'}
          label={`${label}: ${progress}%`}
          className="mt-sm"
        />
      ) : null}
    </div>
  );
}
