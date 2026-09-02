import type { ReactNode } from 'react';

import { cn } from '../../lib/cn.ts';
import { Badge } from '../../primitives/badge.tsx';
import { Progress } from '../../primitives/progress.tsx';
import { Text } from '../../primitives/typography.tsx';
import { CardShell, type CardShellProps } from '../card-base.tsx';

export type CourseCardProps = Omit<CardShellProps, 'children' | 'title'> & {
  title: ReactNode;
  summary?: ReactNode;
  /** Level, duration, number of lessons: whatever the project wants to list. */
  meta?: readonly ReactNode[] | undefined;
  /** Status label: «próximamente», «gratis», «nuevo». */
  status?: ReactNode;
  /**
   * Percentage completed. It only makes sense for someone already enrolled;
   * when passed, the bar goes in sand, which is the color of course progress.
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
    <CardShell className={cn('p-step-lg', className)} {...props}>
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
    </CardShell>
  );
}
