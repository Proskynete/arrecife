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
 *
 * El orden de lectura es icono + título, el número grande, y la bajada debajo.
 * El número va en MEDIO y no al final a propósito: es lo que se viene a leer, y
 * una bajada de dos líneas entre el título y la cifra la entierra. Arriba queda
 * de qué va, en medio cuánto, y abajo el matiz que solo lee quien se para.
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
  /**
   * Glifo al lado del título, a 1em. Hereda `currentColor`, así que sigue al
   * tono del título y no hay que teñirlo aparte.
   */
  icon?: ReactNode;
  /**
   * La bajada: el matiz que el número solo no da. «12 aplicaciones» no dice si
   * son muchas, y aquí es donde se dice.
   */
  description?: ReactNode;
};

export function Stat({
  value,
  label,
  tone = 'neutral',
  progress,
  icon,
  description,
  className,
  ...props
}: StatProps) {
  return (
    <div className={cn(SUPERFICIE_TARJETA, 'p-step-lg gap-step-xs flex flex-col', className)} {...props}>
      <Text variant="eyebrow" tone="muted" as="p" className="gap-step-xs flex items-center">
        {icon ? (
          // `aria-hidden` no hace falta: los glifos del sistema ya lo traen
          // puesto. Lo que sí hace falta es que no encoja al lado de un título
          // largo, porque un icono aplastado se lee como otro icono.
          <span className="shrink-0">{icon}</span>
        ) : null}
        {label}
      </Text>

      <Text variant="stat" as="p" tone={tone === 'alerta' ? 'warm' : 'accent'}>
        {value}
      </Text>

      {description ? (
        <Text variant="ui" tone="secondary" as="p">
          {description}
        </Text>
      ) : null}

      {typeof progress === 'number' ? (
        <Progress
          value={progress}
          tone={tone === 'alerta' ? 'warm' : 'accent'}
          label={`${label}: ${progress}%`}
          className="mt-step-sm"
        />
      ) : null}
    </div>
  );
}
