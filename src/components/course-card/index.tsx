import type { ReactNode } from 'react';

import { cn } from '../../lib/cn.ts';
import { Badge } from '../../primitives/badge.tsx';
import { Progress } from '../../primitives/progress.tsx';
import { Text } from '../../primitives/typography.tsx';
import { Tarjeta, type TarjetaProps } from '../card-base.tsx';

export type CourseCardProps = Omit<TarjetaProps, 'children' | 'title'> & {
  title: ReactNode;
  summary?: ReactNode;
  /** Nivel, duración, número de lecciones: lo que el proyecto quiera listar. */
  meta?: readonly ReactNode[] | undefined;
  /** Etiqueta de estado: «próximamente», «gratis», «nuevo». */
  status?: ReactNode;
  /**
   * Porcentaje cursado. Solo tiene sentido para quien ya está inscrito; cuando
   * se pasa, la barra va en arena, que es el color del progreso de curso.
   */
  progress?: number | undefined;
};

export function CourseCard({
  title,
  summary,
  meta,
  status,
  progress,
  className,
  ...props
}: CourseCardProps) {
  return (
    <Tarjeta className={cn('p-step-lg', className)} {...props}>
      <article className="gap-step-sm flex h-full flex-col">
        {status ? (
          <div>
            <Badge variant="warm">{status}</Badge>
          </div>
        ) : null}

        <Text as="h3" variant="h3" className="group-hover:text-accent transition-standard">
          {title}
        </Text>

        {summary ? (
          <Text variant="ui" tone="secondary" className="line-clamp-3">
            {summary}
          </Text>
        ) : null}

        {meta && meta.length > 0 ? (
          <Text variant="label" tone="muted" as="p" className="gap-step-xs flex flex-wrap items-center">
            {meta.map((m, i) => (
              <span key={i} className="gap-step-xs flex items-center">
                {i > 0 ? <span aria-hidden="true">·</span> : null}
                {m}
              </span>
            ))}
          </Text>
        ) : null}

        {typeof progress === 'number' ? (
          <div className="gap-step-xs mt-auto flex flex-col pt-step-sm">
            <Progress value={progress} tone="warm" label={`Progreso del curso: ${progress}%`} />
            <Text variant="label" tone="muted" as="p">
              {progress}% cursado
            </Text>
          </div>
        ) : null}
      </article>
    </Tarjeta>
  );
}
