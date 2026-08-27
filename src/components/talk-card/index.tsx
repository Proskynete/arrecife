import type { ReactNode } from 'react';

import { cn } from '../../lib/cn.ts';
import { Badge } from '../../primitives/badge.tsx';
import { Text } from '../../primitives/typography.tsx';
import { Tarjeta, type TarjetaProps } from '../card-base.tsx';

export type TalkCardProps = Omit<TarjetaProps, 'children' | 'title'> & {
  title: ReactNode;
  /** Dónde se dio: la conferencia, el meetup, el equipo. */
  event: ReactNode;
  date?: ReactNode;
  dateTime?: string | undefined;
  location?: ReactNode;
  /** Etiqueta corta de estado: «con vídeo», «próxima», «solo audio». */
  status?: ReactNode;
};

export function TalkCard({
  title,
  event,
  date,
  dateTime,
  location,
  status,
  className,
  ...props
}: TalkCardProps) {
  const pie = [
    date ? <time key="fecha" dateTime={dateTime}>{date}</time> : null,
    location ? <span key="lugar">{location}</span> : null,
  ].filter(Boolean);

  return (
    <Tarjeta className={cn('p-lg', className)} {...props}>
      <article className="gap-sm flex h-full flex-col">
        <div className="gap-sm flex items-start justify-between">
          <Text variant="eyebrow" tone="accent" as="p">
            {event}
          </Text>
          {status ? <Badge variant="neutral">{status}</Badge> : null}
        </div>

        <Text as="h3" variant="h3" className="group-hover:text-accent transition-standard">
          {title}
        </Text>

        {pie.length > 0 ? (
          <Text variant="label" tone="muted" as="p" className="gap-xs mt-auto flex items-center pt-sm">
            {pie.map((m, i) => (
              <span key={i} className="gap-xs flex items-center">
                {i > 0 ? <span aria-hidden="true">·</span> : null}
                {m}
              </span>
            ))}
          </Text>
        ) : null}
      </article>
    </Tarjeta>
  );
}
