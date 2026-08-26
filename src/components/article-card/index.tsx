import type { ReactNode } from 'react';

import { cn } from '../../lib/cn.ts';
import { Badge } from '../../primitives/badge.tsx';
import { Text } from '../../primitives/typography.tsx';
import { Tarjeta, type TarjetaProps } from '../card-base.tsx';

export type ArticleCardProps = Omit<TarjetaProps, 'children' | 'title'> & {
  title: ReactNode;
  /** Entradilla. Se corta a dos líneas para que la rejilla no se desalinee. */
  excerpt?: ReactNode;
  /** Fecha ya formateada por el proyecto: la librería no impone locale. */
  date?: ReactNode;
  /** Valor de `datetime` del `<time>`, en ISO. */
  dateTime?: string | undefined;
  readingMinutes?: number | undefined;
  tags?: readonly string[] | undefined;
};

export function ArticleCard({
  title,
  excerpt,
  date,
  dateTime,
  readingMinutes,
  tags,
  className,
  ...props
}: ArticleCardProps) {
  const meta = [
    date ? <time key="fecha" dateTime={dateTime}>{date}</time> : null,
    readingMinutes ? <span key="lectura">{readingMinutes} min de lectura</span> : null,
  ].filter(Boolean);

  return (
    <Tarjeta className={cn('p-md', className)} {...props}>
      <article className="gap-sm flex h-full flex-col">
        {meta.length > 0 ? (
          <Text variant="eyebrow" tone="muted" as="p" className="gap-xs flex items-center">
            {meta.map((m, i) => (
              <span key={i} className="gap-xs flex items-center">
                {i > 0 ? <span aria-hidden="true">·</span> : null}
                {m}
              </span>
            ))}
          </Text>
        ) : null}

        <Text as="h3" variant="h3" className="group-hover:text-accent transition-standard">
          {title}
        </Text>

        {excerpt ? (
          <Text variant="ui" tone="secondary" className="line-clamp-2">
            {excerpt}
          </Text>
        ) : null}

        {tags && tags.length > 0 ? (
          <div className="gap-xs mt-auto flex flex-wrap pt-sm">
            {tags.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
        ) : null}
      </article>
    </Tarjeta>
  );
}
