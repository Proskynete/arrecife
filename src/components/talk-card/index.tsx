import type { ReactNode } from 'react';

import { cn } from '../../lib/cn.ts';
import { Badge } from '../../primitives/badge.tsx';
import { Text } from '../../primitives/typography.tsx';
import { CardShell, type CardShellProps } from '../card-base.tsx';

export type TalkCardProps = Omit<CardShellProps, 'children' | 'title'> & {
  title: ReactNode;
  /** Where it was given: the conference, the meetup, the team. */
  event: ReactNode;
  date?: ReactNode;
  dateTime?: string | undefined;
  location?: ReactNode;
  /** Short status label: «con vídeo», «próxima», «solo audio». */
  status?: ReactNode;
  /**
   * What the talk was about. Clamped to two lines, same as `ArticleCard`'s
   * `excerpt`, so the grid does not fall out of line.
   */
  description?: ReactNode;
};

export function TalkCard({
  title,
  event,
  date,
  dateTime,
  location,
  status,
  description,
  className,
  ...props
}: TalkCardProps) {
  const footer = [
    date ? <time key="date" dateTime={dateTime}>{date}</time> : null,
    location ? <span key="lugar">{location}</span> : null,
  ].filter(Boolean);

  return (
    <CardShell className={cn('p-step-lg', className)} {...props}>
      <article className="gap-step-sm flex h-full flex-col">
        <div className="gap-step-sm flex items-start justify-between">
          <Text variant="eyebrow" tone="accent" as="p">
            {event}
          </Text>
          {status ? <Badge variant="neutral">{status}</Badge> : null}
        </div>

        <Text as="h3" variant="h3" className="group-hover:text-accent transition-standard">
          {title}
        </Text>

        {description ? (
          <Text variant="ui" tone="secondary" className="line-clamp-2">
            {description}
          </Text>
        ) : null}

        {footer.length > 0 ? (
          <Text variant="label" tone="muted" as="p" className="gap-step-xs mt-auto flex items-center pt-step-sm">
            {footer.map((m, i) => (
              <span key={i} className="gap-step-xs flex items-center">
                {i > 0 ? <span aria-hidden="true">·</span> : null}
                {m}
              </span>
            ))}
          </Text>
        ) : null}
      </article>
    </CardShell>
  );
}
